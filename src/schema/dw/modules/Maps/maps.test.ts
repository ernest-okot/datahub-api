import Maps from '.';
import * as prettyFormat from 'pretty-format';
import * as d3 from 'd3';
import db from '../../db';

describe('Maps module tests', () => {
    const maps = new Maps(db);

    it('should return only DAC countries from the data', async () => {
        const dacCountries = ['Spain', 'England'];
        const data = [
            {value: 2000, id: 'sp', name: 'Spain', year: 2000},
            {value: 2000, id: 'uk', name: 'England', year: 2000},
            {value: 2000, id: 'pl', name: 'Poland', year: 2000},
            ];
        const onlyDacCountries = Maps.DACOnlyData(dacCountries, data);
        expect(prettyFormat({onlyDacCountries})).toMatchSnapshot();
        expect(onlyDacCountries.length).toBe(2);
    }, 10000);
    it('should know if an indicator is for a country spotlight or for global picture', async () => {
        const country = await Maps.getCountry('spotlight_on_uganda.uganda_poverty_headcount');
        const global = await Maps.getCountry('data_series.poorest_20_percent');
        expect(country).toBe('uganda');
        expect(global).toBe('global');
    }, 2000);
    it('should return spotlight on uganda indicator data', async () => {
        const linearColored =
            await maps.getMapData('spotlight_on_uganda.uganda_poverty_headcount');
        expect(prettyFormat({linearColored})).toMatchSnapshot();
    }, 20000);
    it('should return global picture indicator for map styled data  ', async () => {
        const surveryP20 = await maps.getMapData('survey_p20');
        expect(prettyFormat({surveryP20})).toMatchSnapshot();
    }, 20000);
    it('should return global picture indicators data ', async () => {
        const linearColored = await maps.getMapData('data_series.non_grant_revenue_ppp_pc');
        const categoricalLinear = await maps.getMapData( 'data_series.fragile_states');
        const dataRevolution = await maps.getMapData( 'data_series.latest_census');
        const largestIntlFinance = await maps.getMapData( 'data_series.largest_intl_flow');
        const forwardLookingOda = await maps.getMapData( 'data_series.largest_intl_flow');
        const governmentFinance = await maps.getMapData( 'data_series.non_grant_revenue_ppp_pc');
        const dacCountries = await maps.getMapData( 'fact.oda_percent_gni');
        // expect(prettyFormat({categoricalLinear})).toMatchSnapshot();
        expect(prettyFormat({linearColored, categoricalLinear, dataRevolution,
            largestIntlFinance, forwardLookingOda, governmentFinance})).toMatchSnapshot();
    }, 20000);
    it('should return categorical value mappings for indicators', async () => {
        const fragileSates = await Maps.getCategoricalMapping('data_series.fragile_states');
        const dataRevolution = await Maps.getCategoricalMapping('data_series.agricultural_census', 'data-revolution');
        expect(prettyFormat({fragileSates, dataRevolution})).toMatchSnapshot();
    }, 5000);
    it('should return color values from a scale', async () => {
        const ramp = {high: '#8f1b13', low: '#f8c1b2', mid: '#e8443a'};
        const scaleA = Maps.colorScale({rangeStr: '1, 5, 10, 20', ramp});
        const scaleB = Maps.colorScale({rangeStr: '500,120,50,20,5', ramp});
        const results = {
            A: {0: scaleA(0), 1: scaleA(1), 5: scaleA(5), 10: scaleA(10), 19: scaleA(19), 100: scaleA(100)},
            B: { 530: scaleB(530), 110: scaleB(110),
                50: scaleB(50), 22: scaleB(22), 2: scaleB(2)},
        };
        expect(prettyFormat(results)).toMatchSnapshot();
    });
    it('should create legend for map data', async () => {
        const rampA = {high: '#8f1b13', low: '#fbd7cb', mid: '#e8443a'};
        const rampB = {high: '#0c457b', low: '#bcd4f0', mid: '#0089cc'};
        const rangeA = '1, 5, 10, 20';
        const rangeB = '200,500,1000,1500,2000,10000';
        const scaleA = Maps.colorScale({rangeStr: rangeA, ramp: rampA});
        const scaleB = Maps.colorScale({rangeStr: rangeB, ramp: rampB, isHighBetter: true});
        const legendA = Maps.createLinearLegend('%', rangeA, scaleA);
        const legendB = Maps.createLinearLegend('unit', rangeB, scaleB);
        expect(prettyFormat({legendB, legendA})).toMatchSnapshot();
    });
    it('should create color ramp', async () => {
        const ramp = {high: '#8f1b13', low: '#f8c1b2', mid: '#e8443a'};
        const colorRamp = await Maps.getColorRamp('red');
        expect(prettyFormat(colorRamp)).toMatchSnapshot();
    }, 20000);
    afterAll(() => {
       db.$config.pgp.end();
    });
});
