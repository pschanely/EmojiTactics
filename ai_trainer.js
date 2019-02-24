
var V = {};
for(let name in BAL) {
    V[name] = tf.variable(tf.scalar(BAL[name]));
}


function displayModel() {
    console.log('model: ', Object.keys(V).map(k=>k+': '+V[k].dataSync()[0].toFixed(4)))
}

//const learningRate = 0.5;
//const optimizer = tf.train.sgd(learningRate);
const optimizer = tf.train.adam();

const NUM_ENTITIES = 6;

const ENTITY_COLS = {
    Hp: 0,
    TotalDamageAmount: 1,
    TotalArmor: 2,
    MovementValueFactor: 3,
    AbilityValueFactor: 4,
};

const ENTITY_NUM_COLS = Object.keys(ENTITY_COLS).length;

const TEAM_LEVEL_COLS = { leaderHp: 0 };

const TEAM_LEVEL_NUM_COLS = 1;

const NUM_COLS_PER_TEAM = TEAM_LEVEL_NUM_COLS + ENTITY_NUM_COLS * NUM_ENTITIES;

const TOTAL_COLS = NUM_COLS_PER_TEAM * 2;


function entityProp(batch, playerIdx, col) {
    var ind = [];
    if (ENTITY_COLS[col] === undefined) {
	throw new Error(col);
    }
    for(var i=0; i<NUM_ENTITIES; i++) {
	ind.push(playerIdx * NUM_COLS_PER_TEAM + TEAM_LEVEL_NUM_COLS + ENTITY_NUM_COLS * i + ENTITY_COLS[col]);
    }
    return batch.gather(ind, 1);
}

function leaderProp(batch, playerIdx, col) {
    var ind = [];
    if (ENTITY_COLS[col] === undefined) {
	throw new Error(col);
    }
    ind.push(playerIdx * NUM_COLS_PER_TEAM + TEAM_LEVEL_NUM_COLS + ENTITY_NUM_COLS * 0 + ENTITY_COLS[col]);
    return batch.gather(ind, 1).flatten();
}

function makeUniverseFeatures(universe) {
    let vec = new Array(NUM_COLS_PER_TEAM * 2);
    vec.fill(0);
    const curPlayerId = universe.getCurPlayer().id;
    const otherPlayerId = universe.getPlayers().filter(p => p.id != curPlayerId)[0].id;
    for(let playerIdx=0; playerIdx < 2; playerIdx++) {
	var playerId = (playerIdx == 0) ? curPlayerId : otherPlayerId;
	var entities = Array.of(...universe.find(Entity, (e => e.getController().id == playerId)));
	var leader = entities.filter(e => e instanceof Leader)[0];
	vec[playerIdx * NUM_COLS_PER_TEAM + 0] = (leader) ? leader.getHp() : 0;
	entities.sort((a,b) => (1000 * (b.hp - a.hp) +
				10 * (b.getTotalDamageAmount() - a.getTotalDamageAmount())));
	for(let eIdx = 0; eIdx < entities.length; eIdx++) {
	    for(let propName in ENTITY_COLS) {
		const propIdx = ENTITY_COLS[propName];
		const vecIdx = playerIdx * NUM_COLS_PER_TEAM + TEAM_LEVEL_NUM_COLS + ENTITY_NUM_COLS * eIdx + propIdx;
		if (vec[vecIdx] !== 0) {
		    throw new Error('bad vec '+vec);
		}
		let val = entities[eIdx]['get'+propName]() / 1.0;
		if (isNaN(val) || val == null || val === undefined) {
		    console.log(entities[eIdx]);
		    throw new Error('invalid property value for '+propName);
		}
		vec[vecIdx] = val;
	    }
	}
    }
    return vec;
}

function entityFeature(batch, playerIdx, feature) {
    var ind = [];
    for(var i=0; i<NUM_ENTITIES; i++) {
	ind.push(playerIdx * NUM_COLS_PER_TEAM + ENTITY_NUM_COLS * i + ENTITY_COLS[col]);
    }
    return batch.gather([ind], 1);
}

function playerValue(batch, playerIdx) {
    let hp = entityProp(batch, playerIdx, 'Hp');
    let dmg = entityProp(batch, playerIdx, 'TotalDamageAmount');
    let armor = entityProp(batch, playerIdx, 'TotalArmor');
    let mov = entityProp(batch, playerIdx, 'MovementValueFactor');
    let abilities = entityProp(batch, playerIdx, 'AbilityValueFactor');
    let defenseAbl = abilities.mul(hp.add(armor).add(mov));
    let defenseDmg = dmg.mul(hp.add(armor)).mul(mov.pow(0.5));
    let leaderHp = leaderProp(batch, playerIdx, 'Hp');
    let baseline = V.hp.mul(hp)
	.add(V.hp2.mul(hp.pow(2)))
	.add(V.dmg.mul(dmg))
	.add(V.armor.mul(armor))
	.add(V.movement.mul(mov))
	.add(V.abilities.mul(abilities))
	.add(V.abilities2.mul(abilities.pow(2)))
	.add(V.defenseabl.mul(defenseAbl))
	.add(V.defenseabl2.mul(defenseAbl.pow(2)))
	.add(V.defensedmg.mul(defenseDmg))
	.add(V.defensedmg2.mul(defenseDmg.pow(2)))
	.add(V.abldefensedmg.mul(abilities.mul(defenseDmg)))
	.sum([1])
	.add(V.leaderhp.mul(leaderHp));
    return baseline;
}

function predict(batch) {
    return tf.tidy(() => {
	batch = tf.tensor2d(batch);
	const lv = playerValue(batch, 0);
	const rv = playerValue(batch, 1);
	return V.first.add(lv).sub(rv).clipByValue(-1, 1);
    });
}

function lossfn(prediction, labels) {
    return tf.tidy(() => {
	let ret = prediction.sub(labels).square()
	return ret.mean();
    });
}

HERO_OPTIONS = [Hero5, Hero6, Hero6M, Hero6A];
SKIP_RATIO = 5.0
function* genSimulationData(iters) {
    const entity_list = Object.values(selectable_entities);
    for(let i = 0; i < iters; i++) {
	while(true) {
	    var ctl = Math.ceil(Math.random() * 5.0);
	    var ctr = Math.ceil(Math.random() * 5.0);
	    const l = [randomChoice(HERO_OPTIONS)];
	    const r = [randomChoice(HERO_OPTIONS)];
	    for(let i=0; i<ctl; i++) l.push(randomChoice(entity_list));
	    for(let i=0; i<ctr; i++) r.push(randomChoice(entity_list));
	    // skip obvious cases?
	    const universe = makeSimulationUniverse(l, r);
	    const ratio = Math.abs(universe.valueForPlayer('p1') / universe.valueForPlayer('p2'));
	    if (ratio < (1.0 / SKIP_RATIO) || ratio > SKIP_RATIO) {
		console.log('skipping ', ratio, ' ', l.map(x=>x.name), 'vs', r.map(x=>x.name));
		continue;
	    }
	    console.log('iter', i, ':', ratio, l.map(x=>x.name), 'vs', r.map(x=>x.name));
	    var iswin = computeWinability(l, r, []);
	    yield {'l_roster': l.map(x=>x.name), 'r_roster': r.map(x=>x.name), 'iswin': iswin};
	    break;
	}
    }
}

function createSimulationData(name, iters) {
    const v = Array.of(...genSimulationData(iters));
    const s = JSON.stringify(v);
    localStorage.setItem(name, s);
    console.log('simulation data created. ', name, ' ', v.length, ' items, ', s.length, ' bytes');
}

function eval(evalData) {
    const [eval_xs, eval_ys] = evalData;
    return tf.tidy(() => {
	var accuracy = 0.0;
	const pred = predict(eval_xs);
	return lossfn(pred, eval_ys).dataSync()[0];
    });
}

async function train(trainData, evalData, numIterations) {
    const [xs, ys] = trainData;
    for(let i=0; i<numIterations; i++) {
	const cost = optimizer.minimize(() => {
	    return lossfn(predict(xs), ys);
	}, true);
	console.log('iter', i, ' cost: ', cost.dataSync()[0], 'eval: ', eval(evalData));
	displayModel();
	await tf.nextFrame();
    }
}

function oneoff_url(r1, r2) {
    return 'file:///Users/pschanely/Dropbox/emojitactics/index.html?r1='+r1.join(',')+'&r2='+r2.join(',');
}

BANNED = {
}

function evalSimulationData(names, featureMaker) {
    var ret = [];
    for(const name of names) {
	for(const rec of JSON.parse(localStorage.getItem(name))) {
	    if ([].concat(rec.l_roster).concat(rec.r_roster).filter(n => BANNED[n]).length > 0) continue;
	    const [lr, rr] = [rec.l_roster, rec.r_roster].map(r => r.map(getTypeByName));
	    let x = makeUniverseFeatures(makeSimulationUniverse(lr, rr))
	    const prediction = predict([x]).dataSync()[0];
	    let loss = eval([[x], [rec.iswin]]);
	    const kind = (loss > 1.0) ? 'loss' : 'ok';
	    ret.push({kind, loss, lr, rr, prediction, actual: rec.iswin, url: oneoff_url(rec.l_roster, rec.r_roster)});
	}
    }
    return ret;
}

function* pairsOf(items) {
    for(var i=0; i<items.length; i++) {
	for(var j=i+1; j<items.length; j++) {
	    yield [items[i], items[j]];
	}
    }
}

function summarizeEvalSimulationData(items) {
    var unitStats = {};
    var pairStats = {};
    for(var typName in all_entities) {
	unitStats[typName] = {name:typName, totalAdvantage:0, count:0, totalMisprediction:0};
    }
    for(const rec of items) {
	for(const typ of rec.lr) {
	    const typName = typ.name;
	    unitStats[typName].count += 1;
	    unitStats[typName].totalAdvantage += rec.actual - rec.prediction;
	    unitStats[typName].totalMisprediction += rec.loss;
	}
	for(const typ of rec.rr) {
	    const typName = typ.name;
	    unitStats[typName].count += 1;
	    unitStats[typName].totalAdvantage -= rec.actual - rec.prediction;
	    unitStats[typName].totalMisprediction += rec.loss;
	}
	for(var [typ1, typ2] of pairsOf(rec.lr)) {
	    if (typ2.name < typ1.name) [typ1, typ2] = [typ2, typ1];
	    let key = typ1.name+','+typ2.name;
	    if (! pairStats[key]) pairStats[key]={name:key, count:0, totalAdvantage:0};
	    pairStats[key].count += 1;
	    pairStats[key].totalAdvantage += rec.actual - rec.prediction;
	}
	for(var [typ1, typ2] of pairsOf(rec.rr)) {
	    if (typ2.name < typ1.name) [typ1, typ2] = [typ2, typ1];
	    let key = typ1.name+','+typ2.name;
	    if (! pairStats[key]) pairStats[key]={name:key, count:0, totalAdvantage:0};
	    pairStats[key].count += 1;
	    pairStats[key].totalAdvantage -= rec.actual - rec.prediction;
	}
    }
    for(const typName in unitStats) {
	var rec = unitStats[typName];
	if (rec.count == 0) {
	    rec.meanAdvantage = rec.meanLoss = 0.0;
	} else {
	    rec.meanAdvantage = rec.totalAdvantage / rec.count;
	    rec.meanLoss = rec.totalMisprediction / rec.count;
	}
    }
    for(const pair in pairStats) {
	var rec = pairStats[pair];
	if (rec.count == 0) {
	    rec.meanAdvantage = 0.0;
	} else {
	    rec.meanAdvantage = rec.totalAdvantage / rec.count;
	}
	if (rec.count < 10 || (-0.25 < rec.meanAdvantage && rec.meanAdvantage < 0.2)) {
	    delete pairStats[pair];
	}
    }
    return [unitStats, pairStats];
}

function readSimulationData(names, featureMaker) { 
    xs = [];
    ys = [];
    for(const name of names) {
	for(const rec of JSON.parse(localStorage.getItem(name))) {
	    if ([].concat(rec.l_roster).concat(rec.r_roster).filter(n => BANNED[n]).length > 0) continue;
	    const [lr, rr] = [rec.l_roster, rec.r_roster].map(r => r.map(getTypeByName));
	    let x = featureMaker(makeSimulationUniverse(lr, rr))
	    xs.push(x);
	    ys.push(rec.iswin);
	}
    }
    return [xs, ys];
}

function datasetNames(start, end) {
    var names = [];
    for(let i=start; i<end; i++) {
	names.push('train'+i);
    }
    return names;
}


// Uncomment below for ad-hoc tasks


// Simulate games and store the resulting data in localStorage:

//for(let i=150; i<200; i++) {
//    createSimulationData('train'+i, 200);
//}


// Use the currently trained coefficients to generate biases for single units and for pairs of units

[unitStats, pairStats] = summarizeEvalSimulationData(evalSimulationData(datasetNames(150, 200)));

// // Learn coefficients based on training data
//
train(readSimulationData(datasetNames(100,140), makeUniverseFeatures),
      readSimulationData(datasetNames(140,200), makeUniverseFeatures), 200)
    .then(() => {
	readSimulationData(datasetNames(120, 122), makeUniverseFeatures);
    });

