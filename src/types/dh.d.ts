// This file is auto generated by the gqlToTs.ts module
// tslint:disable
// graphql typescript definitions

declare namespace DH {
  interface IGraphQLResponseRoot {
    data?: IQuery;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    message: string;            // Required for all errors
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  /*
    description: 
  */
  interface IQuery {
    countries: Array<IIdNamePair> | null;
    countryProfilePageData: Array<IPage> | null;
    odaDonorBubbleChartPageData: Array<IPage> | null;
    globalPicturePageData: Array<IPage> | null;
    povertyBubbleChartPageData: Array<IPage> | null;
    unbundlingOdaPageData: Array<IPage> | null;
    unbundlingOOfPageData: Array<IPage> | null;
    whereThePoorPageData: Array<IPage> | null;
    globalPictureThemes: Array<ITheme> | null;
    spotlightThemes: Array<ITheme> | null;
    bubbleChartOda: IBubbleChartOda | null;
    bubbleChartPoverty: IBubbleChartPoverty | null;
    bubbleSize: Array<IBubbleChartData> | null;
    bubbleChartIndicatorsList: Array<IIdNamePair> | null;
    overViewTab: IOverViewTab | null;
    povertyTab: IPovertyTab | null;
    populationTab: IPopulationTab | null;
    governmentFinance: IGovernmentFinance | null;
    internationalResources: IInternationalResources | null;
    singleResource: ISingleResourceData | null;
    mapData: IMapData | null;
    methodologies: Array<IDataSources> | null;
    overViewTabRegional: IOverViewTabRegional | null;
    povertyTabRegional: IPovertyTabRegional | null;
    populationTabRegional: IPopulationTabRegional | null;
    educationTabRegional: IEducationTabRegional | null;
    healthTabRegional: IHealthTabRegional | null;
    localGovernmentFinance: ILocalGovernmentFinance | null;
    unbundlingAidData: Array<IAidUnit> | null;
    unbundlingSelectionData: IUnbundlingAidSelections | null;
  }

  /*
    description: 
  */
  interface IIdNamePair {
    id: string | null;
    name: string | null;
  }

  /*
    description: 
  */
  interface IPage {
    id: string | null;
    title: string | null;
    narrative: string | null;
  }

  /*
    description: 
  */
  interface ITheme {
    id: string | null;
    name: string | null;
    default_indicator: string | null;
    indicators: Array<IIdNamePair> | null;
  }

  /*
    description: 
  */
  interface IBubbleChartOda {
    revenuePerPerson: Array<IBubbleChartData> | null;
    numberInExtremePoverty: Array<IBubbleChartData> | null;
  }

  /*
    description: 
  */
  interface IBubbleChartData {
    year: number | null;
    value: number | null;
    id: string | null;
    name: string | null;
    income_group: string | null;
    region: string | null;
    uid: string | null;
  }

  /*
    description: 
  */
  interface IBubbleChartPoverty {
    revenuePerPerson: Array<IBubbleChartData> | null;
    percentageInExtremePoverty: Array<IBubbleChartData> | null;
  }

  /*
    description: 
  */
  interface IOverViewTab {
    countryType: string | null;
    poorestPeople: string | null;
    population: string | null;
    domesticResources: string | null;
    internationalResources: string | null;
    governmentSpendPerPerson: string | null;
    averageIncomerPerPerson: Array<IIndicatorData> | null;
    incomeDistTrend: Array<IQuintile> | null;
  }

  /*
    description: 
  */
  interface IIndicatorData {
    year: number | null;
    value: number | null;
    id: string | null;
    name: string | null;
    uid: string | null;
  }

  /*
    description: 
  */
  interface IQuintile {
    value: number | null;
    quintileName: string | null;
  }

  /*
    description: 
  */
  interface IPovertyTab {
    poverty190Trend: Array<IIndicatorData> | null;
    depthOfExtremePoverty: string | null;
    incomeDistTrend: Array<IQuintile> | null;
  }

  /*
    description: 
  */
  interface IPopulationTab {
    population: string | null;
    populationDistribution: Array<IPopulationDistribution> | null;
    populationPerAgeBand: Array<IPopulationPerAgeBand> | null;
  }

  /*
    description: 
  */
  interface IPopulationDistribution {
    group: string | null;
    value: number | null;
    year: number | null;
  }

  /*
    description: 
  */
  interface IPopulationPerAgeBand {
    band: string | null;
    value: number | null;
    year: number | null;
    uid: string | null;
  }

  /*
    description: 
  */
  interface IGovernmentFinance {
    totalRevenue: string | null;
    grantsAsPcOfRevenue: string | null;
    spendingAllocation: Array<ISpendingAllocation> | null;
    currencyCode: string | null;
    expenditure: Array<IDomestic> | null;
    revenueAndGrants: Array<IDomestic> | null;
    finance: Array<IDomestic> | null;
  }

  /*
    description: 
  */
  interface ISpendingAllocation {
    value: number | null;
    name: string | null;
    color: string | null;
    uid: string | null;
  }

  /*
    description: 
  */
  interface IDomestic {
    budgetType: string | null;
    levels: Array<string> | null;
    year: number | null;
    value: number | null;
    valueNcu: number | null;
    uid: string | null;
  }

  /*
    description: 
  */
  interface IInternationalResources {
    startYear: number | null;
    GNI: string | null;
    netODAOfGNIIn: string | null;
    netODAOfGNIOut: string | null;
    resourcesOverTime: Array<IResourceData> | null;
    mixOfResources: Array<IResourceData> | null;
    inflows: Array<IFlow> | null;
    outflows: Array<IFlow> | null;
  }

  /*
    description: 
  */
  interface IResourceData {
    year: number;
    value: number;
    flow_name: string;
    short_name: string | null;
    flow_category: string | null;
    flow_type: string | null;
    direction: string | null;
    color: string | null;
    uid: string | null;
  }

  /*
    description: 
  */
  interface IFlow {
    name: string | null;
    id: string | null;
    selections: Array<IFlowSelection> | null;
  }

  /*
    description: 
  */
  interface IFlowSelection {
    name: string | null;
    id: string | null;
  }

  /*
    description: 
  */
  interface ISingleResourceData {
    resources: Array<IIndicatorData> | null;
    color: string | null;
  }

  /*
    description: 
  */
  interface IMapData {
    map: Array<IMapUnit> | null;
    name: string | null;
    uom_display: string | null;
    uom: string | null;
    start_year: number | null;
    end_year: number | null;
    description: string | null;
    source: string | null;
    source_link: string | null;
    theme: string | null;
    heading: string | null;
    country: string | null;
    legend: Array<ILegendField> | null;
  }

  /*
    description: 
  */
  interface IMapUnit {
    id: string | null;
    name: string | null;
    year: number | null;
    color: string | null;
    value: number | null;
    detail: string | null;
    uid: string | null;
  }

  /*
    description: 
  */
  interface ILegendField {
    label: string | null;
    color: string | null;
    backgroundColor: string | null;
  }

  /*
    description: 
  */
  interface IDataSources {
    name: string | null;
    Description: string | null;
    methodology: string | null;
    unit: string | null;
    source: string | null;
    download: IDownload | null;
  }

  /*
    description: 
  */
  interface IDownload {
    csv: string | null;
    zip: string | null;
  }

  /*
    description: 
  */
  interface IOverViewTabRegional {
    poorestPeople: string | null;
    regionalResources: string | null;
    regionalResourcesBreakdown: Array<IIndicatorDataColored> | null;
    localGovernmentSpendPerPerson: string | null;
  }

  /*
    description: 
  */
  interface IIndicatorDataColored {
    year: number | null;
    value: number | null;
    id: string | null;
    name: string | null;
    color: string | null;
    uid: string | null;
  }

  /*
    description: 
  */
  interface IPovertyTabRegional {
    poorestPeople: string | null;
    lifeExpectancy: string | null;
    stdOfLiving: string | null;
  }

  /*
    description: 
  */
  interface IPopulationTabRegional {
    totalPopulation: string | null;
    populationDensity: string | null;
    populationDistribution: Array<IPopulationDistribution> | null;
    averageDependencyRatio: string | null;
    allAverageDependencyRatio: string | null;
  }

  /*
    description: 
  */
  interface IEducationTabRegional {
    pupilTeacherRatioGovtSchl: string | null;
    pupilTeacherRatioOtherSchl: string | null;
    studentsPassRate: string | null;
    studentsPassDistrictRank: string | null;
    primaryEducationfunding: string | null;
  }

  /*
    description: 
  */
  interface IHealthTabRegional {
    districtPerformance: string | null;
    treatmeantOfTb: string | null;
    healthCareFunding: string | null;
  }

  /*
    description: 
  */
  interface ILocalGovernmentFinance {
    revenueAndGrants: Array<IDomestic> | null;
    expenditure: Array<IDomestic> | null;
  }

  /*
    description: 
  */
  interface IUnbundlingAidQuery {
    aidType: string;
    year: number;
    groupBy: string;
    to_di_id?: string | null;
    from_di_id?: string | null;
    sector?: string | null;
    buddle?: string | null;
    channel?: string | null;
  }

  /*
    description: 
  */
  interface IAidUnit {
    value: number | null;
    name: string | null;
    color: string | null;
    id: string | null;
    year: number | null;
    uid: string | null;
  }

  /*
    description: 
  */
  interface IUnbundlingAidSelections {
    to: Array<IIdNamePair> | null;
    from: Array<IIdNamePair> | null;
    channels: Array<IIdNamePair> | null;
    sectors: Array<IIdNamePair> | null;
    bundles: Array<IIdNamePair> | null;
    years: Array<number> | null;
  }

  /*
    description: 
  */
  interface IToolTip {
    indicator: string | null;
    message: string | null;
  }
}

// tslint:enable
