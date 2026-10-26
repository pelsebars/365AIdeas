const lifeModel = {
 daysPerYear: 365.2425,
 estimate(age, sex) {
  if (!Number.isInteger(age) || age < 0 || age > 90 || !lifeData[sex]) throw Error('Skriv en alder i hele år fra 0 til 90.');
  const table = lifeData[sex];
  return {age, sex, years: table.remaining[age], days: Math.round(table.remaining[age]*this.daysPerYear), maxDays: Math.floor((99-age)*this.daysPerYear)};
 },
 probability(result, day) {
  const age = result.age + day/this.daysPerYear;
  if (day < 0 || age > 99) return null;
  const low = Math.floor(age), high = Math.min(99,low+1), f = age-low;
  const l = lifeData[result.sex].survivors;
  return Math.max(0,Math.min(1,1-(l[low]*(1-f)+l[high]*f)/l[result.age]));
 },
 date(day, start = new Date()) {
  return new Date(start.getFullYear(), start.getMonth(), start.getDate()+day,12);
 },
 shade(p) {return Math.round(255*(1-p));}
};
