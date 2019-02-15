'use strict';

class SimulatedPlayer extends AiPlayer {
    constructor(id) {
	super(id);
    }
}

function makeSimulationUniverse(entities1, entities2) {
    var p1 = new SimulatedPlayer('p1');
    var p2 = new SimulatedPlayer('p2');
    var universe = new Universe([p1, p2], []);
    for(let entityt of entities1) {
	universe.addEntity(new entityt(), p1);
    }
    for(let entityt of entities2) {
	universe.addEntity(new entityt(), p2);
    }
    return universe;
}

function computeWinability(entities1, entities2, upgradeIds) {
    var r1names = entities1.map(t=>t.name);
    var r2names = entities2.map(t=>t.name);
    //console.log('computeWinability { ', r1names, r2names);
    var universe = makeSimulationUniverse(entities1, entities2);

    if (upgradeIds.length > 0) {
	var upgradeObj = {};
	for(const id of upgradeIds) {
	    upgradeObj[id] = true;
	}
	var opts = {leader: universe.getLeader(universe.getCurPlayer().id)};
	runUpgrades(upgradeObj, opts);
    }

    let iswin = isWinFor(universe, universe.getCurPlayer(), 0, 200, 10*1000,  {});
    //console.log('computeWinability } ', r1names, r2names, iswin);
    return iswin;
}

function rosterLabel(roster) {
    return '[' + roster.map(t => {
	var i = (new t()).getIconProps();
	return (i.back ? i.back+':' : '') + (i.front ? i.front : '');
    }).join(' ') + ']';
}

function oldestUnitAvailability(roster, ages) {
    var indices = roster.map(typ => ages.indexOf(typ));
    indices.sort((x,y) => x - y);
    var score = 0;
    for(const index of indices) {
	score = score / 100.0;
	score = score + index;
    }
    return score;
}

const standardRosters = [
    [Violin, Cupid, Lizard, Duck, Rat, Ant, Bug],
    [Fountain, Turtle, OldTakeout, Seat, Duck, Rat, Ant, Bug],
    [Seat, Rabbit, ConstructionBarrier, OldTakeout, Rat, Ant, Bug],
    [GiantSpider, Bomb, Snail, Lizard, Rat, Ant, Bug],
    [SpaceInvader, FlyingImp, Cupid, Robot, CherryBlossum, Rat, Ant, Bug],
    [Doppelganger, FlyingImp, Guard, Angry, Rat, Ant, Bug],
    [Fountain, Rabbit, Fountain ,OldTakeout, GasPump, SpaceInvader],
    [GasPump, OldTakeout, Spider, Turtle, SpaceInvader, Lizard],
];

function generateStandardRosters(typs, maxValue) {
    var typeMap = {};
    for(const typ of typs) {
	typeMap[typ] = true;
    }
    var ret = [];
    for(let idealRoster of standardRosters) {
	var roster = [];
	var space = 0;
	var curValue = maxValue;
	for(let typ of idealRoster) {
	    if (! typeMap[typ]) continue;
	    const space = new typ().value();
	    if (space > curValue) break;
	    roster.push(typ);
	    curValue -= space;
	}
	if (roster.length < 2) continue;
	ret.push(roster);
    }
    return ret;
}

function generateRosters(maxRosters, typs, minValue, maxValue) {
    let prefilter = 10.0 / typs.length ** 1.7
    console.log('typs len', typs.length, 'prefilter prop', prefilter);
    var values = {};
    for(var typ of typs) {
	values[typ.name] = new typ().value();
    }
    var seen = {};
    var ret = [];
    for(var roster of generateRostersRecursive(typs, maxValue, values)) {
	if (Math.random() > prefilter) continue;
	roster.sort();
	var rosterNames = roster.map(t=>t.name);
	const key = hashString(JSON.stringify(rosterNames));
	if (key in seen) continue;
	seen[key] = true;

	var totalValue = sum(roster.map(t=>values[t.name]))
	if (totalValue < minValue) continue;
	ret.push(roster);
    }
    var keepProbability = maxRosters / ret.length;
    ret = ret.filter(r => Math.random() < keepProbability);
    ret.sort((a,b) => oldestUnitAvailability(a, typs) - oldestUnitAvailability(b, typs));
    return ret;
}

function chooseMatrixCell(rows_roster, cols_roster, matrix) {
    var i1, i2;
    for(var i=0; i< 100; i++) {
	i1 = Math.floor(Math.random() * rows_roster.length);
	i2 = Math.floor(Math.random() * cols_roster.length);
	if (matrix[i1][i2] === null) {
	    return [i1, i2, rows_roster[i1].slice(), cols_roster[i2].slice()];
	}
    }
    return null;
}

function advantageMatrix(rosters, matrix) {
    var cell = chooseMatrixCell(rosters, rosters, matrix);
    if (cell != null) {
	var [i1, i2, r1, r2] = cell;
	r1.push(Vilan);
	r2.push(Vilan);
	var iswin = (computeWinability(r1, r2, []) - computeWinability(r2, r1, [])) / 2.0;
	Vue.set(matrix[i1], i2, iswin);
	Vue.set(matrix[i2], i1, -iswin);
    }
    setTimeout(() => advantageMatrix(rosters, matrix), 1000);
}

function storyRosters(chapter, rosterAdvance=2) {
    var model = new AppModel(defaultPersistentState());
    const num_encounters = getNumEncounters(chapter);
    model.emulateStoryProgress(chapter, rosterAdvance);
    const heroTyp = Hero4;
    model.selectedRoster = [];
    const heroSpace = model.rosterValueAvailable();
    var minSpaceUsed = heroSpace - 3;
    console.log('space', heroSpace, minSpaceUsed);
    var heroRosters = generateRosters(40, model.availableRoster, minSpaceUsed, heroSpace);
    heroRosters = generateStandardRosters(model.availableRoster,heroSpace).concat(heroRosters);
    for(var roster of heroRosters) {
	roster.push(heroTyp);
    }
    var enemyRosters = [];
    for(var i = 0; i < num_encounters; i++) {
	const encounter = getEncounter([chapter, i]);
	var roster = encounter.enemies.slice();
	const vilanTyp = encounter.options.vilan || Vilan6;
	roster.push(vilanTyp);
	enemyRosters.push(roster);
    }
    return [heroRosters, enemyRosters, Object.keys(model.upgrades)];
}

function storyMatrix(heroRosters, enemyRosters, matrix, upgradeIds) {
    var cell = chooseMatrixCell(heroRosters, enemyRosters, matrix);
    if (cell != null) {
	var [i1, i2, r1, r2] = cell;
	var iswin = computeWinability(r1, r2, upgradeIds);
	Vue.set(matrix[i1], i2, iswin);
    }
    setTimeout(() => storyMatrix(heroRosters, enemyRosters, matrix, upgradeIds), 1000);
}

function* generateRostersRecursive(typs, maxValue, values) {
    for(let idx=0; idx < typs.length; idx++) {
	let typ = typs[idx];
	if (!typ.name in values) {
	    throw new Error('no value for '+typ);
	}
	var value = values[typ.name];
	if (value > maxValue) continue;
	yield [typ];
	var remainingTypes = typs.slice(idx + 1);
	for(var subRoster of generateRostersRecursive(remainingTypes, maxValue - value, values)) {
	    subRoster.push(typ);
	    yield subRoster;
	}
    }
}

function scoreColor(score) {
    if (score > 0) return 'rgb('+(100-score*100)+'%,100%,'+(100-score*100)+'%)';
    if (score < 0) return 'rgb(100%,'+(100-score*-100)+'%,'+(100-score*-100)+'%)';
    if (score == 0) return 'rgb(100%,100%,100%)';
}

