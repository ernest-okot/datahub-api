import {IDatabase} from 'pg-promise';
import {IExtensions} from '../../db';
import {makeSqlAggregateQuery, entitesFnMap, DONOR, RECIPIENT, MULTILATERAL, CROSSOVER} from '../utils';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import * as shortid from 'shortid';
import {IEntity, getEntities, getRegional, IRegional, getEntityByIdGeneric,
        getSectors, getBundles, getChannels, getColors, IColor} from '../../../cms/modules/global';
import * as R from 'ramda';

interface IUnbundlingAidQuery {
    from_di_id?: string;
    to_di_id?: string;
    year?: number;
    sector?: string;
    bundle?: string;
    channel?: string;
}
interface IUnBundlingAidCountries {
    to: DH.IIdNamePair[];
    from: DH.IIdNamePair[];
}

interface IUnbundlingEnitity {
    id: string;
    color?: string;
    name: string;
    type?: string;
    region?: string;
}

interface IUnbundlingAidResult extends IUnbundlingAidQuery {
    value: string;
}

export default class UnbundlingAid {

    private db: IDatabase<IExtensions> & IExtensions;
    private donorsBlackList = ['country-unspecified', 'region-unspecified', 'organisation-unspecified',
                    'arab-fund', 'afesd', 'idb-sp-fund'];
    constructor(db: any) {
        this.db = db;
    }
    public async getUnbundlingAidData(args: DH.IUnbundlingAidQuery): Promise<DH.IAidUnit[]> {
        try {
            const queryArgs: IUnbundlingAidQuery =  this.getSqlQueryArgs(args);
            const table = this.getUnbundlingAidDataTable(args.aidType);
            const queryStr: string = makeSqlAggregateQuery(queryArgs, args.groupBy, table);
            const raw: IUnbundlingAidResult[] = await this.db.manyCacheable(queryStr, null);
            const entites: IUnbundlingEnitity[] = await entitesFnMap[args.groupBy]();
            const regions: IRegional[] = await getRegional();
            const colors = await getColors();
            return raw.map((obj) => {
                const entity: IUnbundlingEnitity | undefined = entites.find(item => obj[args.groupBy] === item.id);
                if (!entity) throw new Error('error getting unbundling aid entity');
                let color = 'grey';
                if (entity.type && entity.region) {
                    const region: IRegional | undefined = getEntityByIdGeneric<IRegional>(entity.region, regions);
                    if (region && region.color) color = region ? region.color : color;
                }
                const colorObj: IColor = getEntityByIdGeneric<IColor>(color, colors);
                return {id: entity.id, value: Number(obj.value), name: entity.name, uid: shortid.generate(),
                        color: colorObj.value, year: Number(obj.year)};
           });
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public async getUnbundlingSelectionData({aidType}): Promise<DH.IUnbundlingAidSelections> {
        try {
            const table = this.getUnbundlingAidDataTable(aidType);
            const concept: IConcept = await getConceptAsync(`unbundling-${aidType}`, table);
            if (!concept) throw new Error('error getting unbundling aid concept');
            const years: number[] = R.range(Number(concept.start_year), Number(concept.end_year));
            const countries = await this.getCountries();
            const channels = await getChannels();
            const sectors = await getSectors();
            const bundles = await getBundles();
            return {years, ...countries, channels, sectors, bundles};
       } catch (error) {
           console.error(error);
           throw error;
       }
    }
    public getSqlQueryArgs(args: DH.IUnbundlingAidQuery): IUnbundlingAidQuery {
        return R.omit(['groupBy', 'aidType'], args) as IUnbundlingAidQuery;
    }
    private getUnbundlingAidDataTable(aidType) {
        return aidType === 'oda' ? 'fact.oda_2015' : 'data_series.oof';
    }

    private async getCountries(): Promise<IUnBundlingAidCountries> {
        try {
            const entites: IEntity[] = await getEntities();
            return entites.reduce((countries: IUnBundlingAidCountries, entity) => {
            let to: any = [];
            let from: any = [];
            if (entity.donor_recipient_type === RECIPIENT || entity.donor_recipient_type === CROSSOVER ) {
                to = R.append({id: entity.id, name: entity.name}, countries.to);
            }
            if (entity.donor_recipient_type === DONOR || entity.donor_recipient_type === MULTILATERAL
                || entity.donor_recipient_type === CROSSOVER) {
                from = R.contains(entity.id, this.donorsBlackList) ? countries.from :
                    R.append({id: entity.id, name: entity.name}, countries.from);
            }
            if (to.length && from.length) return {to, from};
            if (to.length)  return {...countries, to};
            if (from.length)  return {...countries, from};
            return countries;
            }, {to: [], from: []});
        } catch (error) {
            throw error;
        }
    }

}
