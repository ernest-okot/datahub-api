import {IDatabase} from 'pg-promise';
import * as R from 'ramda';
import {IExtensions} from '../../db';
import {getConceptAsync, IConcept} from '../../../cms/modules/concept';
import {getDistrictBySlugAsync} from '../../../cms/modules/spotlight';
import {IEntity, getEntityById, getEntities, getEntityBySlugAsync,
        getSectors, getBundles, getChannels} from '../../../cms/modules/global';
import {isNumber, isError} from '../../../../lib/isType';
import {getBudgetLevels, IBudgetLevelRef} from '../../../cms/modules/countryProfile';

export interface IGetIndicatorArgs {
    id?: string;
    query: string;
    country?: string;
    table?: string;
    conceptType: string; // folder with concept file
    db: IDatabase<IExtensions> & IExtensions;
}
export interface ISpotlightGetIndicatorArgs {
    id: string;
    query: string;
    country: string;
    l1?: string;
    table?: string;
    conceptType: string; // folder with concept file
    db: IDatabase<IExtensions> & IExtensions;
}
export interface IRAWPopulationGroup {
    di_id: string;
    value_rural: string;
    value_urban: string;
    year: string;
}
export interface IRAWPopulationAgeBand {
    di_id: string;
    value_0_14: string;
    value_15_64: string;
    value_65_and_above: string;
    year: string;
}
interface ISqlSimple {
    indicator: string;
    indicatorRange: string;
}
interface IGetIndicatorArgsSimple {
    id?: string;
    db: IDatabase<IExtensions> & IExtensions;
    start_year?: number;
    end_year?: number;
    sql?: ISqlSimple;
    table?: string;
    query?: string;
}
export interface IRAW {
    di_id: string;
    value: string;
    year: string;
}
export interface IProcessedSimple {
    id: string;
    value: number;
    year: number;
}
export interface IRAWMulti {
    di_id: string;
    value_2: string;
    value_1: string;
    year: string;
}
export interface IRAWQuintile {
    value_bottom_20pc: string;
    value_2nd_quintile: string;
    value_3rd_quintile: string;
    value_4th_quintile: string;
    value_5th_quintile: string;
}
export interface IRAWFlow {
    di_id: string;
    year: string;
    direction: string;
    flow_type: string;
    flow_name: string;
    value: string;
}
export interface IRAWDomestic {
    di_id: string;
    year: string;
    budget_type: string;
    l1: string;
    l2: string;
    l3: string;
    l4: string;
}
export interface Isummable {
    value: number | string | null;
}

export interface IhasDiId {
    di_id: string;
}

export interface IhasId {
    id: string | null;
}

export const RECIPIENT = 'recipient';
export const DONOR = 'donor';
export const MULTILATERAL = 'multilateral';
export const  CROSSOVER = 'crossover';

export const domesticLevelMap = {
    l1: 'type',
    l2: 'parentCategory',
    l3: 'category',
    l4: 'subCategory'
};
export const entitesFnMap = {
    sector: getSectors,
    channel: getChannels,
    bundle: getBundles,
    to: getEntities,
    from_di_id:  getEntities,
    to_di_id: getEntities,
    from: getEntities,
};

export const toNumericFields: (obj: any) => any = (obj) => {
    return R.keys(obj).reduce((newObj: any, key: string) => {
        const isKeyNumerical = Number(obj[key]) ? true : false;
        if (isKeyNumerical) {
            return {...newObj, [key]:  Number(obj[key])};
        }
        return {...newObj, [key]: obj[key]};
    }, {});
};

export const toId: (obj: IhasDiId ) => any = (obj) => {
    if (!obj.di_id) return obj;
    const id = obj.di_id;
    const newObj = R.omit(['di_id'], obj);
    return {...newObj, id };
};

export const getTotal = (data: Isummable[]): number =>
    R.reduce((sum: number, obj: Isummable): number => {
        if (obj.value) sum += Number(obj.value);
        return sum;
    }, 0, data);

export const getTableNameFromSql = (sqlStr: string): string | Error => {
    const matches = sqlStr.match(/FROM(.*)WHERE/);
    if (matches && matches.length) {
        return matches[0].split(/\s/)[1];
    }
    return new Error('couldnt get table name from sql string');
};
export const getSpotlightTableName = (country: string, query: string): string => {
    const tableStr = getTableNameFromSql(query);
    if (isError(tableStr)) throw new Error(`error getting table name for : ${query}`);
    const schema =  `spotlight_on_${country}`;
    return tableStr
            .replace(/\${schema\^}/, schema)
            .replace(/\${country\^}/, country);
};

// used by country profile and spotlights
export async function getIndicatorData<T>(opts: IGetIndicatorArgs): Promise<T[]> {
    const {db, query, id, conceptType, table} = opts;
    const tableName = !table ? getTableNameFromSql(query) : table;
    if (isError(tableName)) throw Error(`error getting table name: ${query}`);
    let countryEntity: any = {};
    if ( conceptType === 'country-profile' && id) countryEntity =  await getEntityBySlugAsync(id);
    const theme =  conceptType === 'country-profile' ? countryEntity.donor_recipient_type : undefined;
    const concept: IConcept = await getConceptAsync(conceptType, tableName, theme);
    const baseQueryArgs = {...concept, ...opts, table: tableName };
    if (conceptType === 'country-profile') {
        const queryArgs = {...baseQueryArgs, id: countryEntity.id};
        return db.manyCacheable(query, queryArgs);
    }
    return db.manyCacheable(query, baseQueryArgs);
}

// used by country profile and spotlights
export async function getIndicatorDataSpotlights<T>(opts: ISpotlightGetIndicatorArgs): Promise<T[]> {
    const {db, query, id, conceptType, country, table} = opts;
    const tableName = !table && country && query ? getSpotlightTableName(country, query) : table;
    if (!tableName) throw new Error('Provide a valid table name or query string');
    const spotlightEntity =  await getDistrictBySlugAsync(country, id);
    const concept: IConcept = await getConceptAsync(conceptType, tableName);
    const queryArgs = {...opts, ...concept, id: spotlightEntity.id, country, schema: `spotlight_on_${country}`};
    // console.log(query, '\n', queryArgs);
    return db.manyCacheable(query, queryArgs);
}

// used by maps module
export const getIndicatorDataSimple = async <T extends {}> (opts: IGetIndicatorArgsSimple): Promise<T[]> => {
        const {table, sql, db, query, start_year, end_year} = opts;
        let queryStr = '';
        if (!query && sql) queryStr = !isNumber(end_year) ? sql.indicator : sql.indicatorRange;
        if (query) queryStr = query;
        const tableName = !table ? getTableNameFromSql(queryStr) : table;
        if (isError(tableName)) throw new Error('No valid table name provided');
        if (!queryStr.length) throw new Error('invalid query string');
        return db.manyCacheable(queryStr, {start_year, end_year, table: tableName});
};

export const addCountryName = (obj: IhasId, entites: IEntity[]): any => {
    if (obj.id === null) return obj;
    const entity = getEntityById(obj.id, entites);
    return {...obj, name: entity.name};
};

export const indicatorDataProcessing = async (data: IhasDiId[]): Promise<DH.IMapUnit[]> => {
    const entities: IEntity[] = await getEntities();
    const processed = indicatorDataProcessingSimple(data) as IhasId[];
    return processed.map((obj) => addCountryName(obj, entities));
};

export const indicatorDataProcessingSimple = <T extends {}>(data: IhasDiId[]): T[] => {
    return data
            .map(toId)
            .map(toNumericFields);
};
// adds reference names to Ids
export const indicatorDataProcessingNamed = async (data: IhasDiId[]):
    Promise<DH.IIndicatorData[]> => {
    const processed: IProcessedSimple[] = indicatorDataProcessingSimple<IProcessedSimple>(data);
    const entities: IEntity[] =  await getEntities();
    return processed.map(obj => {
        const entity = getEntityById(obj.id, entities);
        return {...obj, name: entity.name};
    });
};

export const domesticDataProcessing = async (data: IRAWDomestic[], country?: string)
    : Promise<DH.IDomestic[]> => {
    const budgetRefs: IBudgetLevelRef[] = country ? await getBudgetLevels(country) : await getBudgetLevels();
    return indicatorDataProcessingSimple(data)
            .map(obj => {
                const levelKeys = R.keys(obj).filter(key => key.includes('l'));
                return levelKeys.reduce((acc, key) => {
                    const budgetLevel: IBudgetLevelRef | undefined = budgetRefs.find(ref => ref.id === obj[key]);
                    const budgetLevelName = budgetLevel ? budgetLevel.name : obj[key];
                    return {...acc, [domesticLevelMap[key]]: budgetLevelName };
                }, {...obj}) as DH.IDomestic;
            });
};

export const isDonor = async (slug: string): Promise<boolean>  => {
    const obj: IEntity | undefined = await getEntityBySlugAsync(slug);
    if (!obj) throw new Error('Error in isDonor function, entity is undefined');
    if (obj.donor_recipient_type === DONOR) return true;
    return false;
};

export const normalizeKeyName = (columnName: string): string => {
    const str = columnName.includes('value_') ? columnName.split(/value\_/)[1] : columnName;
    return str.replace(/\_/g, '-');
};

export const normalizeKeyNames = (obj: {}) => {
    return R.keys(obj).reduce((acc, key) => {
        const newKeyName = key.includes('_') ? normalizeKeyName(key) : key;
        if (newKeyName) {
            const newObj = R.omit([key], obj);
            return {...newObj, [newKeyName]: obj[newKeyName]};
        }
        return {...acc, [key]: obj[key]}; // return to default
    }, {});
};
// TODO: unify  makeSqlAggregateQuery & makeSqlAggregateRangeQuery into one function
export const makeSqlAggregateQuery = <T extends {}>
    (queryArgs: T, groupByField: string, table: string): string => {
        const queryArgsKeys = R.keys(queryArgs);
        return queryArgsKeys.reduce((query, field, index) => {
            const AND = index + 1 < queryArgsKeys.length ? 'AND' : `GROUP BY ${groupByField}, year`;
            return `${query} ${field} = ${queryArgs[field]} ${AND}`;
        }, `SELECT ${groupByField}, year, sum(value) AS value from ${table} WHERE value > 0 AND`);
};

export const makeSqlAggregateRangeQuery = <T extends {years: number[]}>
    (queryArgs: T, groupByField: string, table: string): string => {
        const queryArgsKeys = R.keys(queryArgs);
        return queryArgsKeys.reduce((query, field, index) => {
            const AND = index + 1 < queryArgsKeys.length ? 'AND' : `GROUP BY ${groupByField}, year`;
            if (field === 'years' && queryArgs.years.length === 2) {
                 return `${query} year >= ${queryArgs.years[0]} AND year <= ${queryArgs.years[1]} ${AND}`;
            }
            return `${query} ${field} = ${queryArgs[field]} ${AND}`;
        }, `SELECT ${groupByField}, year, sum(value) As value from ${table} WHERE value > 0 AND`);
};