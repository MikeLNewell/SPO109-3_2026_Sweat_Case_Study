/** Educational physiological calculations. All mass and volume sign conventions are explicit. */
export const sodiumMolarMassMg = 22.98976928;
export const sodiumChlorideMolarMassMg = 58.44277;
export const session = {
  athlete: 'Participant S', sex:'Male', heightCm:178, date:'26 October 2026',
  exerciseMin:45, speedKph:9, initialMassKg:69, mass15Kg:68.85, finalMassKg:68.55,
  bottleInitialG:822, bottleFinalG:646, urineOsm:260,
  series: [
    {time:0, hr:70, rpe:6, thermal:2, core:37.19, temp:24.9, humidity:40.2},
    {time:15, hr:191, rpe:14, thermal:5.5, core:null, temp:25, humidity:46.1},
    {time:30, hr:200, rpe:15, thermal:6, core:38.76, temp:25, humidity:54.5},
    {time:45, hr:198, rpe:16, thermal:6.5, core:38.84, temp:25.1, humidity:55.2}
  ]
};
export const patches = [
  {id:'left-forearm', label:'Left forearm', region:'Forearm', side:'Left', postG:7.103, standardG:6.678, sodium:45, lowVolume:false},
  {id:'right-forearm', label:'Right forearm', region:'Forearm', side:'Right', postG:7.001, standardG:6.678, sodium:48, lowVolume:false},
  {id:'left-thigh', label:'Left thigh', region:'Thigh', side:'Left', postG:6.908, standardG:6.678, sodium:77, lowVolume:true},
  {id:'right-thigh', label:'Right thigh', region:'Thigh', side:'Right', postG:6.989, standardG:6.678, sodium:46, lowVolume:false},
  {id:'left-back', label:'Left lower back', region:'Lower back', side:'Left', postG:7.616, standardG:6.604, sodium:55, lowVolume:false},
  {id:'right-back', label:'Right lower back', region:'Lower back', side:'Right', postG:7.535, standardG:6.604, sodium:45, lowVolume:false}
] as const;

export function grossLoss({initialMassKg, finalMassKg, bottleStartG, bottleEndG, durationMin, urineL=0}: {
  initialMassKg:number; finalMassKg:number; bottleStartG:number; bottleEndG:number; durationMin:number; urineL?:number;
}) {
  const massLossKg = initialMassKg-finalMassKg;
  const intakeL = (bottleStartG-bottleEndG)/1000;
  const sweatL = massLossKg+intakeL-urineL;
  return {massLossKg, massChangePct:(finalMassKg-initialMassKg)/initialMassKg*100,intakeL,sweatL,rateLh:sweatL/(durationMin/60)};
}
export function gasDerived(vo2Lmin:number,vco2Lmin:number,tempC:number,rhPercent:number,durationMin:number) {
  const choGmin = 4.210*vco2Lmin-2.962*vo2Lmin;
  const fatGmin = 1.695*vo2Lmin-1.701*vco2Lmin;
  const vapourPressureKPa = 0.61078 * Math.exp(17.27*tempC/(tempC+237.3))*rhPercent/100;
  const ambientVapourPressureMmHg = vapourPressureKPa*7.500616827;
  const respiratoryWaterGmin = 0.019*vo2Lmin*(44-ambientVapourPressureMmHg);
  const oxidisedKg = (choGmin+fatGmin)*durationMin/1000;
  const metabolicWaterL = ((choGmin*0.6)+(fatGmin*1.13))*durationMin/1000;
  const respiratoryWaterL = respiratoryWaterGmin*durationMin/1000;
  return {choGmin,fatGmin,ambientVapourPressureMmHg,respiratoryWaterGmin,oxidisedKg,metabolicWaterL,respiratoryWaterL};
}
export function correctedSweatL(grossSweatL:number, gas:ReturnType<typeof gasDerived>){
  return grossSweatL-gas.oxidisedKg+gas.metabolicWaterL-gas.respiratoryWaterL;
}
export function patchSweatG(postG:number,standardG:number) {return postG-standardG;}
export function localSweatGm2h(sweatG:number,areaCm2:number,durationMin:number){
  return sweatG/(areaCm2/10000)/(durationMin/60);
}
export function wholeBodySodium(site:'forearm'|'thigh', regionalNa:number){
  return site==='forearm' ? 0.589*regionalNa+14.299 : 0.831*regionalNa+11.775;
}
export function sodiumLoss({sweatRateLh,sodiumMmolL,durationH}:{sweatRateLh:number;sodiumMmolL:number;durationH:number}){
  const fluidL=sweatRateLh*durationH;
  const mmol=fluidL*sodiumMmolL;
  return {fluidL, mmol, sodiumMg:mmol*sodiumMolarMassMg, saltMg:mmol*sodiumChlorideMolarMassMg};
}
export type SodiumModel = {
  bodyMassKg:number; tbwFraction:number; baselineNa:number; durationH:number;
  sweatRateLh:number; sweatSodium:number; sweatPotassium:number;
  fluidReplacementPct:number; beverageNaMmolL:number; potassiumIntakeMmol:number;
  additionalSodiumMmol?:number; urineLossL?:number; urineNaMmol?:number; urineKMmol?:number;
  extraFluidL?:number; respiratoryLossL?:number; metabolicGainL?:number;
};
export function modelBalance(p:SodiumModel){
  const tbwPre=p.bodyMassKg*p.tbwFraction;
  const sweatL=p.durationH*p.sweatRateLh;
  const fluidL=sweatL*p.fluidReplacementPct/100+(p.extraFluidL||0);
  const tbwPost=tbwPre+fluidL-sweatL-(p.urineLossL||0)-(p.respiratoryLossL||0)+(p.metabolicGainL||0);
  const naLoss=sweatL*p.sweatSodium+(p.urineNaMmol||0);
  const kLoss=sweatL*p.sweatPotassium+(p.urineKMmol||0);
  const beverageNa=fluidL*p.beverageNaMmolL;
  const potassiumIntake=p.potassiumIntakeMmol;
  const baseNa=beverageNa+(p.additionalSodiumMmol||0);
  // Sodium needed for the chosen target=baseline, from Sage ch.6 / Kurtz–Nguyen.
  const sodiumTargetTotal=(tbwPost*(p.baselineNa+23.8)-tbwPre*(p.baselineNa+23.8))/1.03 +naLoss+kLoss-potassiumIntake;
  const sodiumExtra=Math.max(0,sodiumTargetTotal-beverageNa);
  const forward=(totalNaMmol:number)=> (tbwPre*(p.baselineNa+23.8)+1.03*(totalNaMmol+potassiumIntake-naLoss-kLoss))/tbwPost-23.8;
  const result={tbwPre,tbwPost,sweatL,fluidL,naLoss,kLoss,beverageNa,sodiumTargetTotal,sodiumExtra,
    noExtraSodiumPred:forward(beverageNa), selectedPred:forward(baseNa),
    sweatReplacementPred:forward(naLoss),
    targetStrategyPred:forward(beverageNa+sodiumExtra),
    sodiumRequirementPctOfSweat:naLoss>0?sodiumTargetTotal/naLoss*100:0,
    physicalValidity:tbwPost>0 && p.fluidReplacementPct>=0 && p.durationH>0 && p.sweatRateLh>0
  };
  return result;
}
export function closeTo(actual:number,expected:number,absTol:number=.02){return Number.isFinite(actual)&&Math.abs(actual-expected)<=absTol;}
export function fmt(n:number,digits=2){return Number.isFinite(n)?n.toFixed(digits):'—';}
