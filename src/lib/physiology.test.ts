import {describe,it,expect} from 'vitest';
import {correctedSweatL,gasDerived,grossLoss,localSweatGm2h,patchSweatG,sodiumLoss,wholeBodySodium,modelBalance,sodiumMolarMassMg,sodiumChlorideMolarMassMg} from './physiology';
describe('mass balance',()=>{
 it('body mass loss uses positive convention and percent remains signed',()=>{
  const p=grossLoss({initialMassKg:69,finalMassKg:68.55,bottleStartG:822,bottleEndG:646,durationMin:45});
  expect(p.massLossKg).toBeCloseTo(.45);expect(p.massChangePct).toBeCloseTo(-.652173913,5);expect(p.intakeL).toBeCloseTo(.176);expect(p.sweatL).toBeCloseTo(.626);expect(p.rateLh).toBeCloseTo(.83466667);
 });
 it('corrected sweat removes substrate and expired water only once',()=>{
  const gas=gasDerived(2.127626,2.016765,25,50,45);
  expect(gas.choGmin).toBeGreaterThan(0);expect(gas.fatGmin).toBeGreaterThan(0);
  const corr=correctedSweatL(.626,gas);expect(corr).toBeGreaterThan(.45);expect(corr).toBeLessThan(.626);
 });
 it('local patch area uses cm² to m², minutes to hours',()=>{
  expect(patchSweatG(7.001,6.678)).toBeCloseTo(.323);
  expect(localSweatGm2h(.323,10,30)).toBeCloseTo(646);
 });
});
describe('sodium characterisation',()=>{
 it('validated site-specific equations',()=>{
  expect(wholeBodySodium('forearm',48)).toBeCloseTo(42.571);
  expect(wholeBodySodium('thigh',46)).toBeCloseTo(50.001);
 });
 it('distinguishes elemental sodium from NaCl',()=>{
  const p=sodiumLoss({sweatRateLh:1,sodiumMmolL:40,durationH:2});
  expect(p.mmol).toBe(80);expect(p.sodiumMg).toBeCloseTo(80*sodiumMolarMassMg);
  expect(p.saltMg).toBeCloseTo(80*sodiumChlorideMolarMassMg);
 });
});
describe('plasma sodium model',()=>{
 const base={bodyMassKg:69,tbwFraction:.6,baselineNa:140,durationH:3,sweatRateLh:1,sweatSodium:50,sweatPotassium:3.5,fluidReplacementPct:80,beverageNaMmolL:0,potassiumIntakeMmol:0};
 it('forward and rearranged equations agree when target non-negative',()=>{
  const p=modelBalance(base);expect(p.sodiumExtra).toBeGreaterThan(0);expect(p.targetStrategyPred).toBeCloseTo(140,8);
 });
 it('zero fluid replacement increases sodium, assuming hypotonic sweat',()=>{
  const p=modelBalance({...base,fluidReplacementPct:0});expect(p.noExtraSodiumPred).toBeGreaterThan(140);
 });
 it('high fluid intake without sodium lowers plasma sodium prediction',()=>{
  const low=modelBalance({...base,fluidReplacementPct:30});const high=modelBalance({...base,fluidReplacementPct:100});
  expect(high.noExtraSodiumPred).toBeLessThan(low.noExtraSodiumPred);
 });
 it('negative requirement clipped to zero additional sodium',()=>{
  const p=modelBalance({...base,fluidReplacementPct:20});expect(p.sodiumTargetTotal).toBeLessThan(0);expect(p.sodiumExtra).toBe(0);
 });
});
