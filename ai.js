
class BinaryHeap {
    constructor(scoreFunction) {
	this.content = [];
	this.scoreFunction = scoreFunction;
    }
    push(element) {
	this.content.push(element);
	this.bubbleUp(this.content.length - 1);
    }
    pop() {
	var result = this.content[0];
	var end = this.content.pop();
	if (this.content.length > 0) {
	    this.content[0] = end;
	    this.sinkDown(0);
	}
	return result;
    }
    remove(node) {
	var length = this.content.length;
	for (var i = 0; i < length; i++) {
	    if (this.content[i] != node) continue;
	    var end = this.content.pop();
	    if (i == length - 1) break;
	    this.content[i] = end;
	    this.bubbleUp(i);
	    this.sinkDown(i);
	    break;
	}
    }
    size() {
	return this.content.length;
    }
    bubbleUp(n) {
	var element = this.content[n], score = this.scoreFunction(element);
	while (n > 0) {
	    var parentN = Math.floor((n + 1) / 2) - 1,
		parent = this.content[parentN];
	    if (score >= this.scoreFunction(parent))
		break;
	    this.content[parentN] = element;
	    this.content[n] = parent;
	    n = parentN;
	}
    }
    sinkDown(n) {
	var length = this.content.length,
	    element = this.content[n],
	    elemScore = this.scoreFunction(element);

	while(true) {
	    var child2N = (n + 1) * 2, child1N = child2N - 1;
	    var swap = null;
	    if (child1N < length) {
		var child1 = this.content[child1N],
		    child1Score = this.scoreFunction(child1);
		if (child1Score < elemScore)
		    swap = child1N;
	    }
	    if (child2N < length) {
		var child2 = this.content[child2N],
		    child2Score = this.scoreFunction(child2);
		if (child2Score < (swap == null ? elemScore : child1Score))
		    swap = child2N;
	    }
	    if (swap == null) break;
	    this.content[n] = this.content[swap];
	    this.content[swap] = element;
	    n = swap;
	}
    }
};

function getFuture(universe, action) {
    if (action == null) {
	var future = deepClone(universe);
	future.autoPass();
	return future;
    } else {
	universe.actionStack.push(action);
	var future = deepClone(universe);
	universe.actionStack.pop();
	future.passCount = 0;
	return future;
    }
}

function getFutures(universe) {
    var curPlayer = universe.getCurPlayer();
    futures = [];
    for (const option of curPlayer.getOptions(universe)) {
	futures.push([option, getFuture(universe, option)]);
    }
    futures.push([null, getFuture(universe, null)]);
    return futures;
}

function winEstimateForPlayer(universe, playerId) {
    var myValue = universe.valueForPlayer(playerId);
    var totalValue = sum(universe.getPlayers().map(p => universe.valueForPlayer(p.id)));
    if (totalValue == 0) {
	return 0;
    } else {
	return (myValue / totalValue - 0.5) * 2.0;
    }
}

function isWinFor(universe, player, depth, maxDepth, timeout, cache) {
    var lastEstimate = 0.0;
    var cutoff = new Date().getTime() + timeout;
    var numIters = 0;
    universe = deepClone(universe);
    var scorer = getScorer(universe, {}, player.id);
    while(lastEstimate > -1.0 && lastEstimate < 1.0) {
	const poked = scorer.poke(maxDepth);
	lastEstimate = scorer.estimate();
	if (!poked) {
	    break;
	}
	numIters += 1;
	if (new Date().getTime() > cutoff) {
	    break;
	}
    }
    //console.log('isWinFor (iters=', numIters, '): ', lastEstimate, '[action=', scorer.bestAction(),']');
    return lastEstimate;
}

function* invertScorer(scorer) {
    for(var [minVal, estimate, maxVal] of scorer) {
	yield [-maxVal, -estimate, -minVal];
    }
}

function getScorer(universe, cache, viewerId) {
    while(universe.isResponding()) {
	universe.autoPass();
    }
    let scorer;
    var winner = universe.gameEnded();
    if (winner) {
	if (winner == 'tie') {
	    ret = 0.0;
	} else {
	    ret = (winner.id == viewerId) ? 1.0 : -1.0;
	}
	return new LiteralScorer(ret);
    }
    const hsh = universe.getHash();
    if (hsh in cache) {
	scorer = cache[hsh];
    } else {
	scorer = new Scorer(universe, cache);
	cache[hsh] = scorer;
    }
    if (universe.getCurPlayer().id != viewerId) {
	scorer = new InvertingScorer(scorer);
    }
    return scorer;
}

class LiteralScorer {
    constructor(value) { this.value = value; }
    poke(maxDepth) { return false; }
    estimate() { return this.value; }
}

class InvertingScorer {
    constructor(scorer) {
	this.scorer = scorer;
    }
    poke(maxDepth) {
	return this.scorer.poke(maxDepth);
    }
    estimate() { return -this.scorer.estimate(); }
    bestAction() { return this.scorer.bestAction(); }
}

class Scorer {
    constructor(universe, cache) {
	const playerId = universe.getCurPlayer().id;
	this.universe = universe;
	this.cache = cache;
	this.playerId = playerId;
	this.est = winEstimateForPlayer(universe, playerId);
	this.agedMax = new LiteralScorer(-1.0);
	this.agedScorers = [];
	// highest estimates at top
	this.scorers = null;
    }
    estimate() {
	return Math.max(this.agedMax.estimate(), this.est); // TODO : might be able to remove the max
    }
    bestAction() {
	var greediestAction = null;
	var estimate = -2.0;
	for(var action of this.bestActions()) {
	    var future = getFuture(this.universe, action);
	    while(future.isResponding()) {
		future.autoPass();
	    }
	    const curEstimate = winEstimateForPlayer(future, this.playerId);
	    //console.log('Choosing from among best options (',curEstimate,'): ', (action == null) ? 'null' : action.oneliner());
	    if (curEstimate > estimate) {
		greediestAction = action;
		estimate = curEstimate;
	    }
	}
	return greediestAction;
    }
    bestActions() {
	var bestActions = [];
	var bestEst = -2.0;
	var allScorers = this.agedScorers.slice().concat(this.scorers.content);
	for(var scorer of allScorers) {
	    //console.log('bestActions scorer ', scorer.estimate(), (scorer.action == null) ? 'null':scorer.action.oneliner());
	    if (scorer.estimate() > bestEst) {
		bestActions = [scorer.action];
		bestEst = scorer.estimate();
	    } else if (scorer.estimate() == bestEst) {
		bestActions.push(scorer.action);
	    }
	}
	//console.log(bestActions.length + ' best actions, estimate: ' + bestEst);
	return bestActions;
    }
    poke(maxDepth) {
	if (maxDepth == 0) return false;
	let scorers = this.scorers;
	if (scorers == null) {
	    scorers = new BinaryHeap((s) => -s.estimate());
	    this.scorers = scorers;
	    var futures = getFutures(this.universe);
	    if (futures.length == 0) {
		throw new Error();
	    }
	    for(const [action, future] of futures) {
		var scorer = getScorer(future, this.cache, this.playerId);
		scorer.action = action;
		if (scorer != null) {
		    scorers.push(scorer);
		}
	    }
	    if (scorers.content.length == 0) {
		throw new Error();
	    } else {
		this.est = scorers.content[0].estimate();
		return true;
	    }
	}
	if (this.est >= 1.0) {
	    return false;
	}
	while(scorers.content.length > 0) {
	    let top = scorers.pop();
	    if (top.poke(maxDepth - 1)) {
		scorers.push(top);
		this.est = Math.max(this.agedMax.estimate(), scorers.content[0].estimate());
		return true;
	    } else {
		this.agedScorers.push(top);
		if (top.estimate() > this.agedMax.estimate()) {
		    this.agedMax = new LiteralScorer(top.estimate());
		    this.agedMax.action = top.action;
		}
	    }
	}
	return false;
    }
}

function* winEstimateRefiner(universe, depth, maxDepth, cache) {
    cache = {...cache};
    var player = universe.getCurPlayer();
    function log(...args) {
	if (false) {
	    console.log(player.id, '.'.repeat(depth), ...args);
	}
    }
    var winner = universe.gameEnded();
    if (winner) {
	ret = 0;
	if (winner == 'tie') {
	    log('tie');
	} else {
	    ret = (winner.id == player.id) ? 1 : -1;
	    if (winner.id == player.id) {
		log('win');
	    } else {
		log('lost');
	    }
	}
	log('End game: ', ret);
	yield [ret, ret, ret];
	return;
    }
    var initialEstimate = winEstimateForPlayer(universe, player.id);
    log(initialEstimate);
    
    yield [-1, initialEstimate, 1];
    var futures = getFutures(universe);
    const hsh = universe.getHash();
    var stop = false;
    if (depth >= maxDepth) {
	log('Max depth');
	stop = true;
    } else if (hsh in cache) {
	log('Loop');
	stop = true;
    } else if (universe.getEntities().length > 15) {
	log('too many entities');
	stop = true;
    }
	
    cache[hsh] = null; // marker for loop detection
    if (stop) {
	while(universe.isResponding()) {
	    universe.autoPass();
	}
	const estimate = winEstimateForPlayer(universe, player.id);
	log('Stop: ', estimate, '(', player.id, ')');
	yield [estimate, estimate, estimate];
    } else if (futures.length == 1 && futures[0][0] == null) {
	// skip turns that are pass-only
	var nextUniverse = futures[0][1];
	if (nextUniverse.getCurPlayer().id == player.id) {
	    yield* winEstimateRefiner(nextUniverse, depth, maxDepth, cache);
	} else {
	    yield* invertScorer(winEstimateRefiner(nextUniverse, depth, maxDepth, cache));
	}
    } else {
	var scorers = new BinaryHeap(([scorer, l, e, u]) => -e);
	var initialSubEstimate = initialEstimate;

	let lowerBound = -1;
	let estimate = -1;
	let upperBound = -1;
	const checker = (l, e, u) => {
	    if (l == lowerBound) {
		if (e > estimate) {
		    estimate = e;
		    upperBound = u;
		}
	    } else if (l >= lowerBound) {
		lowerBound = l;
		estimate = e;
		upperBound = u;
	    }
	};
	
	for(const [_, future] of futures) {
	    log(future.oneliner());
	    while(future.isResponding()) {
		future.autoPass();
	    }
	    var scorer = winEstimateRefiner(future, depth+1, maxDepth, cache);
	    if (future.getCurPlayer().id != player.id) {
		scorer = invertScorer(scorer);
	    }
	    var {value, done} = scorer.next();
	    if (done) {
		throw new Error();
	    } else {
		const [subLower, subEstimate, subUpper] = value;
		checker(subLower, subEstimate, subUpper);
		if (lowerBound >= 1) {
		    yield [1,1,1];
		    return;
		}
		if (upperBound >= -1) {
		    scorers.push([scorer, subLower, subEstimate, subUpper]);
		}
	    }
	}
	yield [lowerBound, estimate, upperBound];
	while(scorers.size() > 0) {
	    var [scorer, oldLower, oldEstimate, oldUpper] = scorers.pop();
	    var {value, done} = scorer.next();
	    if (done && value === undefined) {
		continue;
	    }
	    const [subLower, subEstimate, subUpper] = value;
	    checker(subLower, subEstimate, subUpper);
	    const nextRec = [scorer, subLower, subEstimate, subUpper];
	    if (!done) {
		scorers.push(nextRec);
	    }
	    yield [lowerBound, estimate, upperBound];
	    if (lowerBound >= 1.0 || upperBound <= -1.0) break;
	}
    }
}


class AiPlayer extends Player {
    constructor(id) {
	super(id);
    }
    getColor() { return '#510'; }
    isSelf() { return false; }
}

class SmartAi extends AiPlayer {
    think(uistate, scorer, lastEstimate, iters) {
	var cutoff = new Date().getTime() + 50;
	while(lastEstimate > -1.0 && lastEstimate < 1.0) {
	    const poked = scorer.poke(8);
	    lastEstimate = scorer.estimate();
	    if (!poked) {
		break;
	    }
	    if (new Date().getTime() > cutoff) {
		if (iters > 0) {
		    setTimeout(() => this.think(uistate, scorer, lastEstimate, iters - 1), 50);
		    return;
		} else {
		    break;
		}
	    }
	}
	const best_action = scorer.bestAction();
	if (best_action == null) {
	    //console.log('ai: passing.');
	    uistate.pass();
        } else {
	    //console.log('ai: performing action: ', best_action);
	    uistate.universe.pushAction(best_action);
	    uistate.triggerOpponent();
        }
    }
    act(universe, uistate) {
	//console.log('ai: I am supposed to do something now.');
	const options = Array.from(this.getOptions(universe));
	//console.log('options', options);
	if (options.length == 0) {
	    uistate.pass();
	} else {
	    setTimeout(() => {
		this.think(uistate, new Scorer(universe, {}), 0.0, 30);
	    }, 200);
	}
    }
}
