import {IDatabase} from 'pg-promise';
import {getTotal} from '../../../../utils';
import {Icms} from '../../../cms/';
import * as R from 'ramda';

interface IgetMapDataOpts {
    indicatorType: string;
    startYear: number;
    endYear: number;
    DACOnly: boolean;
}

export default class Maps {
    public static DACOnlyData(DACCountries: string[], indicatorData: DH.IMapUnit[]): DH.IMapUnit[] {
       return DACCountries.map(countryName =>
            R.find((obj: DH.IMapUnit) => obj.countryName === countryName, indicatorData));
    }

    private db: IDatabase<any>;

    constructor(db: any) {
        this.db = db;
    }
    public async getMapData(opts: IgetMapDataOpts, cms: Icms): Promise<DH.IAggregatedMap> {
        console.info(cms);
        const indicatorData: DH.IMapUnit[] = await this.getIndicatorData(opts);
        const label: string = opts.indicatorType;
        // TODO: Get unit value from refrence file
        const unit: string = '%';
        // console.log(indicatorData[0]);
        const DACcountries = await this.getDACCountries();
        const mapData = opts.DACOnly ? Maps.DACOnlyData(DACcountries, indicatorData) : indicatorData;
        const total: number = getTotal(mapData);
        return {map: mapData, label, unit, total};
    }

    private async getDACCountries(): Promise<string[]> {
        const donors: Array<{donor_name: string}> = await this.db.many(this.createDACQuery(), 'DAC');
        return donors
            .map(donor => donor.donor_name);
    }
    private getIndicatorData(opts: IgetMapDataOpts): Promise<DH.IMapUnit[]> {
        return this.db.any(this.createIndicatorQuery(), opts);
    }
    private createIndicatorQuery() {
        return 'SELECT * FROM data_series.${indicatorType^} WHERE year >= ${startYear} AND year <= ${endYear}';
    }
    private createDACQuery() {
        return 'SELECT donor_name FROM dimension.oecd_donor where donor_type = $1';
    }
}