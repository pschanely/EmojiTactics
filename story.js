
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/emoji-tactics/service-worker.js', { scope: '/emoji-tactics/' })
        .then(function(registration) {
            console.log('Service Worker Registered');
        });
    navigator.serviceWorker.ready.then(function(registration) {
        console.log('Service Worker Ready');
    });
}

function setupUniverse(roster, enemyRoster, enemyAi) {
    var p1 = new UiPlayer();
    if (!enemyAi) {
	enemyAi = new SmartAi('ai');
    }
    var universe = new Universe([p1, enemyAi], []);
    p1.setRoster(roster.slice());
    enemyAi.setRoster(enemyRoster.slice())
    p1.spawn(universe);
    enemyAi.spawn(universe);
    return universe;
}

class Encounter {
    constructor(intro, background, backgroundClass, enemies, options = {}) {
	this.intro = intro;
	this.background = background;
	this.backgroundClass = backgroundClass;
	this.enemies = enemies;
	this.options = options;
    }
}

function encounter(introBackground, enemies, {unlocks: nextEncounters, sky='sky-gradient-12', ...options}) {
    if (!nextEncounters) nextEncounters = [];
    return [new Encounter({background:introBackground, content:'', backgroundClass:sky},
			  '', sky, enemies, options), nextEncounters];
}

function back(icon) {
    return icon;
}

ORDERED_CHAPTERS = [
    UHOUSE,
    UHOUSE_AND_YARD,
    UHOUSES,
    UTREE,
    USTORE,
    UFACTORY,
    UWORN_HOUSE,
    UTENT,
    UEU_CASTLE,
    UGREEK_TEMPLE,
    UJP_CASTLE,
    UMOUNTAIN,
];

CHAPTERS = {}

CHAPTERS[UHOUSE] = [
    encounter(
	UBED,
	[Bug], {
	    sky: 'sky-gradient-04',
	    vilan: Vilan4,
	    libraryAward: {typ: Bug},
	}),
    encounter(
	UCLOCK,
	[Ant, Ant], {
	    sky: 'sky-gradient-05',
	    vilan: Vilan4,
	    libraryAward: {typ: Ant},
	}),
    encounter(
	UBATHTUB,
	[Duck, Duck], {
	    sky: 'sky-gradient-06',
	    vilan: Vilan4,
	    libraryAward: {typ: Duck},
	}),
    encounter(
	UCOFFEE,
	[Duck, Rat], {
	    sky: 'sky-gradient-07',
	    vilan: Vilan4,
	    libraryAward: {typ: Rat},
	}),
    encounter(
	UTAKEOUT,
	[Rat, OldTakeout], {
	    sky: 'sky-gradient-05',
	    vilan: Vilan4,
	    libraryAward: {typ: OldTakeout},
	}),
    encounter(
	UDOOR,
	[Cat, Duck],
	{
	    sky: 'sky-gradient-06',
	    vilan: Vilan4,
	    libraryAward: {typ: Cat},
	    unlocks:[[UHOUSE_AND_YARD, 0]],
	}),
];

CHAPTERS[UHOUSE_AND_YARD] = [
    encounter(
	UBEE,
	[Bird, Bee], {
	    sky: 'sky-gradient-07',
	    libraryAward: {typ: Bee},
	}),
    encounter(
	USNAIL,
	[Bee, Bird, Snail], {
	    sky: 'sky-gradient-07',
	    libraryAward: {typ: Snail},
	}),
    encounter(
	UBIRD,
	[Bird, Bird, Bird], {
	    sky: 'sky-gradient-08',
	    libraryAward: {typ: Bird},
	}),
    encounter(
	ULIZARD,
	[Lizard, Snail, Bird, Ant], {
	    sky: 'sky-gradient-08',
	    libraryAward: {typ: Lizard},
	}),
    encounter(
	UTURTLE,
	[Turtle, Lizard, Bug], {
	    sky: 'sky-gradient-08',
	    libraryAward: {typ: Turtle},
	}),
    encounter(
	UFOUNTAIN,
	[Fountain, Duck, Turtle, Bird], {
	    sky: 'sky-gradient-08',
	    libraryAward: {typ: Fountain},
	    unlocks:[[UHOUSES, 0], [UTREE, 0]],
	}),
];

CHAPTERS[UHOUSES] = [
    encounter(
	USTORE,
	[Rat, Bird, GasPump, GasPump], {
	    sky: 'sky-gradient-09',
	    libraryAward: {typ: GasPump},
	    unlocks:[[USTORE, 0]],
	}),
    encounter(
	UFACTORY,
	[Angry, Angry], {
	    sky: 'sky-gradient-13',
	    libraryAward: {typ: Angry},
	    unlocks:[[UFACTORY, 0]],
	}),
    encounter(
	UWORN_HOUSE,
	[Spider, Spider, GasPump, Rat, Snail, Lizard], {
	    sky: 'sky-gradient-17',
	    libraryAward: {typ: Spider},
	    unlocks:[[UWORN_HOUSE, 0]],
	}),
    encounter(
	UEU_CASTLE,
	[Guard, Guard, Chipmunk], {
	    sky: 'sky-gradient-09',
	    libraryAward: {typ: Guard},
	    unlocks:[[UEU_CASTLE, 0]],
	}),
    encounter(
	UGREEK_TEMPLE,
	[Goat, Goat, Goat], {
	    sky: 'sky-gradient-10',
	    libraryAward: {typ: Goat},
	    unlocks:[[UGREEK_TEMPLE, 0]],
	}),
    encounter(
	UJP_CASTLE,
	[CherryBlossum, Bird, Bird, Dog], {
	    sky: 'sky-gradient-11',
	    libraryAward: {typ: CherryBlossum},
	    unlocks:[[UJP_CASTLE, 0]],
	}),
];

CHAPTERS[USTORE] = [
    encounter(
	UKITCHEN_KNIFE,
	[Bird, Angry, KitchenKnife], {
	    sky: 'sky-gradient-10',
	    vilan: Vilan6A,
	    libraryAward: {typ: KitchenKnife},
	}),
    encounter(
	UBURRITO,
	[BurritoMan, BurritoMan, Ant], {
	    sky: 'sky-gradient-11',
	    vilan: Vilan6A,
	    libraryAward: {typ: BurritoMan},
	}),
    encounter(
	UICE_CREAM,
	[Dog, BurritoMan, GasPump, IceCream], {
	    sky: 'sky-gradient-12',
	    vilan: Vilan6A,
	    libraryAward: {typ: IceCream},
	}),
    encounter(
	UCUP_WITH_STRAW,
	[Soda, KitchenKnife, IceCream, BurritoMan, BurritoMan], {
	    sky: 'sky-gradient-13',
	    vilan: Vilan6A,
	    libraryAward: {typ: Soda},
	}),
    encounter(
	UTONGUE_FACE,
	[Taunter, Rat, HotDog, BurritoMan], {
	    sky: 'sky-gradient-14',
	    vilan: Vilan6A,
	    libraryAward: {typ: Taunter},
	}),
    encounter(
	UKISSING,
	[Kisser, Taunter, BurritoMan, Rat], {
	    sky: 'sky-gradient-15',
	    vilan: Vilan6A,
	    libraryAward: {typ: Kisser},
	}),
];

CHAPTERS[UWORN_HOUSE] = [
    encounter(
	UZOMBIE,
	[Spider, Zombie, Zombie, Zombie], {
	    sky: 'sky-gradient-18',
	    vilan: Vilan7A,
	    libraryAward: {typ: Zombie},
	}),
    encounter(
	USKULL,
	[Zombie, Skeleton, Zombie, Skeleton], {
	    sky: 'sky-gradient-19',
	    vilan: Vilan7A,
	    libraryAward: {typ: Skeleton},
	}),
    encounter(
	UCASKET,
	[Necromancer, Spider, Skeleton, Skeleton], {
	    sky: 'sky-gradient-20',
	    vilan: Vilan7A,
	    libraryAward: {typ: Necromancer},
	}),
    encounter(
	UBOW,
	[Zombie, Skeleton, SkeletonArcher, SkeletonArcher, Spider], {
	    sky: 'sky-gradient-21',
	    vilan: Vilan7A,
	    libraryAward: {typ: SkeletonArcher},
	}),
    encounter(
	UZOMBIE,
	[GiantZombie, Skeleton, Zombie], {
	    sky: 'sky-gradient-22',
	    vilan: Vilan7A,
	    libraryAward: {typ: GiantZombie},
	}),
    encounter(
	UFIRE,
	[FireSkeleton, FireSkeleton, Skeleton, SkeletonArcher, Necromancer], {
	    sky: 'sky-gradient-23',
	    vilan: Vilan7A,
	    libraryAward: {typ: FireSkeleton},
	}),
];

CHAPTERS[UFACTORY] = [
    encounter(
	UCOMPUTER,
	[SpaceInvader, SpaceInvader, Angry], {
	    sky: 'sky-gradient-14',
	    vilan: Vilan6M,
	    libraryAward: {typ: SpaceInvader},
	}),
    encounter(
	UROBOT,
	[Robot, SpaceInvader, Angry], {
	    sky: 'sky-gradient-15',
	    vilan: Vilan6M,
	    libraryAward: {typ: Robot},
	}),
    encounter(
	UWOMAN + UJ + UFACTORY,
	[FactoryWorker, Robot, Angry], {
	    sky: 'sky-gradient-16',
	    vilan: Vilan6M,
	    libraryAward: {typ: FactoryWorker},
	}),
    encounter(
	UCONSTRUCTION,
	[ConstructionBarrier, FactoryWorker, SpaceInvader, Robot, Spider], {
	    sky: 'sky-gradient-17',
	    vilan: Vilan6M,
	    libraryAward: {typ: ConstructionBarrier},
	}),
    encounter(
	UBOMB,
	[Dog, Fountain, ConstructionBarrier, Rat, Bomb], {
	    sky: 'sky-gradient-18',
	    vilan: Vilan6M,
	    libraryAward: {typ: Bomb},
	}),
    encounter(
	UFLOATING_MAN,
	[FloatingMan, FactoryWorker, Angry, SpaceInvader], {
	    sky: 'sky-gradient-19',
	    vilan: Vilan6M,
	    libraryAward: {typ: FloatingMan},
	}),
];

CHAPTERS[UTREE] = [
    encounter(
	URABBIT,
	[Rabbit, Rabbit, Ant], {
	    sky: 'sky-gradient-10',
	    vilan: Vilan5,
	    libraryAward: {typ: Rabbit},
	}),
    encounter(
	UMUSHROOM,
	[Mushroom, Snail, Mushroom, Rabbit], {
	    sky: 'sky-gradient-11',
	    vilan: Vilan5,
	    libraryAward: {typ: Mushroom},
	}),
    encounter(
	UCHIPMUNK,
	[Chipmunk, Lizard, Rabbit], {
	    sky: 'sky-gradient-12',
	    vilan: Vilan5,
	    libraryAward: {typ: Chipmunk},
	}),
    encounter(
	UDEER,
	[Chipmunk, Deer, Deer, Snail], {
	    sky: 'sky-gradient-13',
	    vilan: Vilan5,
	    libraryAward: {typ: Deer},
	}),
    encounter(
	UELF,
	[Elf, Lizard, Deer], {
	    sky: 'sky-gradient-14',
	    vilan: Vilan5,
	    libraryAward: {typ: Elf},
	}),
    encounter(
	UELF+UJ+UFEMALE,
	[BladeElf, Deer, Snail], {
	    sky: 'sky-gradient-15',
	    vilan: Vilan5,
	    libraryAward: {typ: BladeElf},
	    unlocks:[[UTENT, 0]],
	}),
];

CHAPTERS[UTENT] = [
    encounter(
	UBAT,
	[Bat, Bat, Bat, Bat, Snail], {
	    sky: 'sky-gradient-16',
	    vilan: Vilan6A,
	    libraryAward: {typ: Bat},
	}),
    encounter(
	UOWL,
	[Owl, Owl, Bat, Bat, Rat], {
	    sky: 'sky-gradient-17',
	    vilan: Vilan6A,
	    libraryAward: {typ: Owl},
	}),
    encounter(
	URED_GOBLIN,
	[RedGoblin, RedGoblin, RedGoblin, Bat], {
	    sky: 'sky-gradient-18',
	    vilan: Vilan6A,
	    libraryAward: {typ: RedGoblin},
	}),
    encounter(
	UWOLF,
	[WolfRider, WolfRider, RedGoblin, Snail], {
	    sky: 'sky-gradient-19',
	    vilan: Vilan6A,
	    libraryAward: {typ: WolfRider},
	}),
    encounter(
	URED_OGRE,
	[RedOgre, Bat, Bat, Bat], {
	    sky: 'sky-gradient-20',
	    vilan: Vilan6A,
	    libraryAward: {typ: RedOgre},
	}),
    encounter(
	USPIDER,
	[GiantSpider, Snail, Bat, WolfRider, RedGoblin], {
	    sky: 'sky-gradient-21',
	    vilan: Vilan6A,
	    libraryAward: {typ: GiantSpider},
	    unlocks:[[UMOUNTAIN, 0]],
	}),
];

CHAPTERS[UMOUNTAIN] = [
    encounter(
	URAM,
	[Ram, Ram, Bird, Bird], {
	    sky: 'sky-gradient-06',
	    vilan: Vilan8MA,
	    libraryAward: {typ: Ram},
	}),
    encounter(
	UCLOUD,
	[StormCloud, StormCloud, Rabbit, Owl, Chipmunk, Ram], {
	    sky: 'sky-gradient-07',
	    vilan: Vilan8MA,
	    libraryAward: {typ: StormCloud},
	}),
    encounter(
	UFACE_BLOWING,
	[WindElemental, Bird, Bird, Ram, Rabbit], {
	    sky: 'sky-gradient-08',
	    vilan: Vilan8MA,
	    libraryAward: {typ: WindElemental},
	}),
    encounter(
	UEAGLE,
	[EagleRider, EagleRider, WindElemental, Ram, Ram, Rabbit], {
	    sky: 'sky-gradient-09',
	    vilan: Vilan8MA,
	    libraryAward: {typ: EagleRider},
	}),
    encounter(
	UICE,
	[IceMan, EagleRider, WindElemental, Ram, Ram], {
	    sky: 'sky-gradient-10',
	    vilan: Vilan8MA,
	    libraryAward: {typ: IceMan},
	}),
    encounter(
	UDRAGON,
	[Dragon], {
	    sky: 'sky-gradient-11',
	    vilan: Vilan8MA,
	    libraryAward: {typ: Dragon},
	}),
];

CHAPTERS[UEU_CASTLE] = [
    encounter(
	UBOW,
	[Archers, Guard, Guard], {
	    sky: 'sky-gradient-14',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Archers},
	}),
    encounter(
	UHORSE_FACE,
	[Knight, Guard, Guard], {
	    sky: 'sky-gradient-15',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Knight},
	}),
    encounter(
	UWIZARD,
	[ElementalMage, Guard, Ant], {
	    sky: 'sky-gradient-16',
	    vilan: Vilan6MA,
	    libraryAward: {typ: ElementalMage},
	}),
    encounter(
	UVIOLIN,
	[ElementalMage, Violin, Guard], {
	    sky: 'sky-gradient-17',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Violin},
	}),
    encounter(
	UPERSON,
	[Doppelganger, ElementalMage, Knight], {
	    sky: 'sky-gradient-18',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Doppelganger},
	}),
    encounter(
	UELECTRIC,
	[Doppelganger, ElementalMage, ElectroMage, Guard], {
	    sky: 'sky-gradient-19',
	    vilan: Vilan6MA,
	    libraryAward: {typ: ElectroMage},
	}),
];

CHAPTERS[UJP_CASTLE] = [
    encounter(
	UCRICKET,
	[CherryBlossum, Dog, Cricket, Cricket, Cricket], {
	    sky: 'sky-gradient-08',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Cricket},
	}),
    encounter(
	USQUID,
	[CherryBlossum, CherryBlossum, Squid, Squid], {
	    sky: 'sky-gradient-09',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Squid},
	}),
    encounter(
	UMARTIAL_ARTS_ROBE,
	[CherryBlossum, Ninja, Ninja], {
	    sky: 'sky-gradient-10',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Ninja},
	}),
    encounter(
	UBENTO_BOX,
	[BentoBox, Ninja, Ninja], {
	    sky: 'sky-gradient-11',
	    vilan: Vilan6MA,
	    libraryAward: {typ: BentoBox},
	}),
    encounter(
	UPANDA_FACE,
	[CherryBlossum, StoutNinja, Ninja, Ninja], {
	    sky: 'sky-gradient-12',
	    vilan: Vilan6MA,
	    libraryAward: {typ: StoutNinja},
	}),
    encounter(
	UCROSSED_SWORDS,
	[BentoBox, GiantNinja, Ninja], {
	    sky: 'sky-gradient-13',
	    vilan: Vilan6MA,
	    libraryAward: {typ: GiantNinja},
	}),
];

CHAPTERS[UGREEK_TEMPLE] = [
    encounter(
	UWINE_GLASS,
	[Archers, Goat, Wine, Rabbit, Chipmunk], {
	    sky: 'sky-gradient-10',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Wine},
	}),
    encounter(
	UPURPLE_IMP,
	[Imp, Goat, Goat], {
	    sky: 'sky-gradient-11',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Imp},
	}),
    encounter(
	USHIELD,
	[Imp, ArmoredImp, Goat], {
	    sky: 'sky-gradient-12',
	    vilan: Vilan6MA,
	    libraryAward: {typ: ArmoredImp},
	}),
    encounter(
	UBUTTERFLY,
	[Imp, FlyingImp, Goat, Wine], {
	    sky: 'sky-gradient-13',
	    vilan: Vilan6MA,
	    libraryAward: {typ: FlyingImp},
	}),
    encounter(
	UHEART_ARROW,
	[Cupid, Cupid, Goat, ArmoredImp, Wine], {
	    sky: 'sky-gradient-14',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Cupid},
	}),
    encounter(
	UTRIDENT,
	[Zeus, Goat, Cupid, FlyingImp, Wine], {
	    sky: 'sky-gradient-15',
	    vilan: Vilan6MA,
	    libraryAward: {typ: Zeus},
	    unlocks:[],
	}),
];


function check_chapters() {
    var defined = Object.keys(CHAPTERS);
    defined.sort();
    var ordered = ORDERED_CHAPTERS.slice();
    ordered.sort();
    if (JSON.stringify(defined) != JSON.stringify(ordered)) {
	console.log('ordered', ordered);
	console.log('defined', defined);
	throw new Error();
    }
}
check_chapters();

function getNumEncounters(chapter) {
    return CHAPTERS[chapter].length;
}
function getEncounter([chapter, phase]) {
    return CHAPTERS[chapter][phase][0];
}
function getNextEncounters(curEncounter) {
    const [curEncounterName, curPhase] = curEncounter;
    const curEncounterPhases = CHAPTERS[curEncounterName];
    var [encounter, nextEncounters] = curEncounterPhases[curPhase];
    nextEncounters = nextEncounters.splice(0);
    if (curEncounterPhases.length > curPhase + 1) {
	nextEncounters.push([curEncounterName, curPhase + 1]);
    }
    return nextEncounters;
}

function hasEncounter(encounter, encounterList) {
    return encounterList.filter(([n,i]) => n==encounter[0] && i==encounter[1]).length > 0;
}

function savePersistentState (state) {
    localStorage.setItem('state', JSON.stringify(state));
}

class Logger {
    constructor(url_base, storageKey = 'log') {
	this.url_base = url_base;
	this.storageKey = storageKey;
	this.selfid = this.getLocal('selfid', uniqId());
    }
    addLog(entry) {
	this.queue([entry]);
	this.attemptSend();
    }
    getLocal(suffix, default_value) {
	var val = localStorage.getItem(this.storageKey+'.'+suffix);
	if (! val) {
	    this.setLocal(suffix, default_value);
	    return default_value;
	} else {
	    return JSON.parse(val);
	}
    }
    setLocal(suffix, val) {
	localStorage.setItem(this.storageKey+'.'+suffix, JSON.stringify(val));
    }
    attemptSend() {
	if (navigator.onLine) {
	    var pending = this.getLocal('pending', []);
	    var payload = [this.selfid, pending];
	    fetch(this.url_base + encodeURIComponent(JSON.stringify(payload))).catch(error => {
		console.error(error);
		this.queue(pending);
	    });
	    this.setLocal('pending', []);
	}
    }
    queue(entries) {
	var pending = this.getLocal('pending', []);
	if (pending.length > 200) {
	    console.error('too many logs queued; dropped');
	    pending = [];
	}
	pending = pending.concat(entries);
	this.setLocal('pending', pending);
	return pending;
    }
}

function defaultPersistentState () {
    return {
	storyProgress: {
	    availableEncounters: [[UHOUSE, 0]],
	    completedEncounters: [],
	},
	soundOn: true,
	money: 0,
	upgrades: {},
	flags: {},
	availableRosterNames: ['Dog'],
	configuredRosters: [['Dog'],[],[]],
    };
}
    
function loadPersistentState () {
    var state = localStorage.getItem('state')
    if (state) {
	return JSON.parse(state);
    }
    state = defaultPersistentState();
    savePersistentState(state);
    return state;
}

const ALL_UPGRADES = [
    {
	id: 'b1',
	cost: 2,
	display: '25'+UBACKPACK+' '+URIGHT_ARROW+' 28'+UBACKPACK,
	condition: (o) => { return o.rosterSpace; },
	effect: (o) => { o.rosterSpace += 3; }
    },
    {
	id: 'h1',
	cost: 2,
	display: '4'+UHEART+' '+URIGHT_ARROW+' 5'+UHEART,
	condition: (o) => { return o.leader },
	effect: (o) => {o.leader.maxHp +=1; o.leader.hp += 1;}
    },
    {
	id: 'b2',
	unlocked_by: 'b1',
	cost: 5,
	display: '28'+UBACKPACK+' '+URIGHT_ARROW+' 31'+UBACKPACK,
	condition: (o) => { return o.rosterSpace; },
	effect: (o) => { o.rosterSpace += 3; }
    },
    {
	id: 'h2',
	unlocked_by: 'h1',
	cost: 5,
	display: '5'+UHEART+' '+URIGHT_ARROW+' 6'+UHEART,
	condition: (o) => { return o.leader },
	effect: (o) => {o.leader.maxHp +=1; o.leader.hp += 1;}
    },
    {
	id: 'b3',
	unlocked_by: 'b2',
	cost: 8,
	display: '31'+UBACKPACK+' '+URIGHT_ARROW+' 34'+UBACKPACK,
	condition: (o) => { return o.rosterSpace; },
	effect: (o) => { o.rosterSpace += 3; }
    },
    {
	id: 'h3',
	unlocked_by: 'h2',
	cost: 8,
	display: '6'+UHEART+' '+URIGHT_ARROW+' 7'+UHEART,
	condition: (o) => { return o.leader },
	effect: (o) => {o.leader.maxHp +=1; o.leader.hp += 1;}
    },
    {
	id: 's1',
	cost: 10,
	display: '1'+USHOE+' '+URIGHT_ARROW+' 2'+USHOE,
	condition: (o) => { return o.leader },
	effect: (o) => { o.leader.movement += 1; o.leader.maxMovement +=1; }
    },
    {
	id: 'b4',
	unlocked_by: 'b3',
	cost: 10,
	display: '34'+UBACKPACK+' '+URIGHT_ARROW+' 37'+UBACKPACK,
	condition: (o) => { return o.rosterSpace; },
	effect: (o) => { o.rosterSpace += 3; }
    },
    {
	id: 'a1',
	cost: 15,
	display: URIGHT_ARROW+' 1'+UDAGGER,
	condition: (o) => { return o.leader },
	effect: (o) => {
	    o.leader.abilities.push(new Engage());
	    o.leader.addDamage(new Slash(1));
	},
    },
];


function runUpgrades(upgrades, opts) {
    for(const upgrade of ALL_UPGRADES) {
	if (upgrades[upgrade.id]) {
	    if (upgrade.condition(opts)) {
		upgrade.effect(opts);
	    }
	}
    }
}
    
class AppModel {
    constructor(persistentState) {
	this.availableRoster = persistentState.availableRosterNames.map(n => selectable_entities[n]);
	this.availableUpgrades = ALL_UPGRADES;
	this.money = persistentState.money || 0.0;
	this.upgrades = persistentState.upgrades || {};
	this.flags = persistentState.flags || {};
	this.rosterIndex = persistentState.rosterIndex || 0;
	this.configuredRosters = persistentState.configuredRosters;
	this.storyProgress = persistentState.storyProgress;
	this.soundOn = persistentState.soundOn;
	this.mode = null;
	this.gamesetup = {};
	this.game = {};
	this.curEncounter = null;
	this.chapters = CHAPTERS;
	this.text = {};
	this.logger = new Logger('log?e=');
	this.loadSelectedRoster();
	// compatibility:
	while (this.configuredRosters.length < 3) this.configuredRosters.push([]);
    }
    loadSelectedRoster() {
	this.selectedRoster = this.configuredRosters[this.rosterIndex].map(n => selectable_entities[n]);
    }
    saveSelectedRoster() {
	this.configuredRosters[this.rosterIndex] = this.selectedRoster.map(typ => typ.name);
    }
    savePersistentState() {
	this.saveSelectedRoster();
	savePersistentState({
	    storyProgress: this.storyProgress,
	    soundOn: this.soundOn,
	    money: this.money,
	    flags: this.flags,
	    upgrades: this.upgrades,
	    availableRosterNames: this.availableRoster.map(typ => typ.name),
	    rosterIndex: this.rosterIndex,
	    configuredRosters: this.configuredRosters,
	});
    }
    resetGame() {
	if (confirm('Reset game? You will lose all progress.')) {
	    localStorage.removeItem('state');
	    localStorage.removeItem('selfid');
	    window.location.reload();
	}
    }
    startEncounterSelection() {
	if (false &&
	    this.storyProgress.availableEncounters.length == 1 &&
	    this.selectedRoster.length == this.availableRoster.length) {
	    this.startEncounter(...this.storyProgress.availableEncounters[0]);
	} else {
	    this.mode = 'lobby';
	}
    }
    startEncounter(encounterName, encounterPhase) {
	const [encounter, next_encounters] = CHAPTERS[encounterName][encounterPhase];
	this.curEncounter = [encounterName, encounterPhase];
	this.game = {
	    universe: null,
	    uistate: null,
	    background: encounter.background,
	    backgroundClass: encounter.backgroundClass,
	};
	this.mode = 'text';
	this.text = encounter.intro;
	this.text.next = () => {
	    var enemies = encounter.enemies.slice();
	    if (encounter.options.vilan) {
		enemies.push(encounter.options.vilan);
	    } else {
		enemies.push(Vilan6);
	    }
	    var roster = [Hero4].concat(this.selectedRoster);
	    this.startGame(roster, enemies, encounter.options.ai);
	    this.logger.addLog([1, encounterName, encounterPhase,
				Math.round(new Date().getTime()/1000) - 1546300800]);
	};
    }
    
    startGame(heroRoster, enemyRoster, ai) {
	const universe = setupUniverse(heroRoster, enemyRoster, ai);
	var opts = {leader:universe.getLeader('pl')};
	runUpgrades(this.upgrades, opts);
	this.game.universe = universe;
	this.game.uistate = new UiState(universe, (s) => {
	    if (this.soundOn) s.play();
	});
	this.mode = 'game';
	this.text = null;
    }

    pass() {
	const winner = this.game.uistate.universe.gameEnded();
	if (winner) {
	    if (winner != 'tie' && winner.isSelf()) {
		const encounter = getEncounter(this.curEncounter);
		if (!hasEncounter(this.curEncounter, this.storyProgress.completedEncounters)) {
		    const nextEncounters = getNextEncounters(this.curEncounter);
		    this.storyProgress.completedEncounters.push(this.curEncounter);
		    this.storyProgress.availableEncounters =
			this.storyProgress.availableEncounters.filter(
			    e => (e[0] != this.curEncounter[0] || e[1] != this.curEncounter[1])
			).concat(nextEncounters);
		    this.money += 1;
		    if (encounter.options.libraryAward) {
			this.award(encounter.options.libraryAward.typ);
		    }
		}
		this.savePersistentState();
	    } 
	    this.startEncounterSelection();
	} else {
	    this.game.uistate.pass();
	}
    }

    nextIcon() {
	const winner = this.game.uistate.universe.gameEnded();
        if (! winner) return '';
        if (winner == 'tie') return UNEUTRAL_FACE+' ';
	if (winner.isSelf()) return UCONFETTI+' ';
	return UCRY+' ';
    }
    
    makeDudEntity(typ) {
	var dud = new typ();
	dud.abilities = dud.abilities.map( a => new DudAbility(a) );
	return dud;
    }
    setFlag(flagName, value) {
	if (this.flags[flagName] != value) {
	    this.flags[flagName] = value;
	    this.savePersistentState();
	}
    }
    
    award(typ) {
	this.availableRoster.push(typ);
	if (this.rosterValueAvailable() > (new typ()).value()) {
	    this.selectedRoster.push(typ);
	}
	this.availableRoster.sort((a,b) => (new a()).value() - (new b()).value());
    }

    rosterValueAvailable() {
	var opts = {rosterSpace: 25};
	runUpgrades(this.upgrades, opts);
	return Math.round(opts.rosterSpace - this.rosterCost());
    }
    
    rosterCost() {
	var cost = 0;
	for(const typ of this.selectedRoster) {
	    cost += (new typ()).value();
	}
	return cost;
    }
    
    toggleRosterEntity(typ) {
	this.setFlag('seenRoster', true);
	var others = this.selectedRoster.filter(t=>t!==typ);
	if (others.length == this.selectedRoster.length) {
	    this.selectedRoster.push(typ);
	} else {
	    this.selectedRoster = others;
	}
	this.savePersistentState();
    }

    switchRosterIndex(index) {
	console.log(index);
	this.saveSelectedRoster();
	this.rosterIndex = index;
	this.loadSelectedRoster();
    }

    curRosterIndex() {
	return this.rosterIndex;
    }
    
    toggleSound() {
	this.soundOn = !this.soundOn;
	this.savePersistentState();
    }
    
    purchaseUpgrade(upgrade) {
	if (this.money >= upgrade.cost) {
	    console.log('purchased', upgrade.id);
	    Vue.set(this.upgrades, upgrade.id, true);
	    this.money -= upgrade.cost;
	}
	this.savePersistentState();
    }

    
    getEncounterInfo() {
	var ret = [];
	for(let chapterName of ORDERED_CHAPTERS) {
	    var encounters = CHAPTERS[chapterName].map(
		(encounter, number) => {
		    const completed = hasEncounter([chapterName, number], this.storyProgress.completedEncounters);
		    const unlocked = hasEncounter([chapterName, number], this.storyProgress.availableEncounters);
		    return {number, unlocked, completed, icon: encounter[0].intro.background};
		});
	    ret.push({encounters, name: chapterName});
	}
	return ret;
    }
    
    emulateStoryProgress(encounter, phase) {
	var encounters = this.storyProgress.availableEncounters;
	for(var i=0; i<100; i++) {
	    if (encounters.filter(e => e[0] == encounter && e[1] == phase).length > 0) {
		this.storyProgress.availableEncounters = encounters;
		// purchase every upgrade up to available money
		for(const upgrade of ALL_UPGRADES) {
		    this.purchaseUpgrade(upgrade);
		}
		return;
	    }
	    var nextEncounters = [];
	    for(const encounterName of encounters) {
		const encounter = getEncounter(encounterName);
		nextEncounters = nextEncounters.concat(getNextEncounters(encounterName));
		this.money += 1;
		if (encounter.options.libraryAward) {
		    this.award(encounter.options.libraryAward.typ);
		}
	    }
	    encounters = nextEncounters;
	}
	console.log('Could not find encounter for emulation');
    }
    
}


function modelComponent(model) {
    return {
	el: '#app',
	data: model,
	computed: {
	    rosterSpaceLeft: () => model.rosterValueAvailable(),
	    rosterCost: model.rosterCost,
	    rosterContents: () => Object.assign({}, ...model.selectedRoster.map(typ => ({[typ.name]:true}))),
	    encounterInfo: () => model.getEncounterInfo(),
	},
	methods: {
	    version: () => _VER,
	    hasUpgrade: (u) => model.upgrades[u.id],
	    hasFlag: (flagName) => model.flags[flagName],
	    setFlag: (flagName, value) => model.setFlag(flagName, value),
	    resetGame: () => model.resetGame(),
	    upgradeUnlocked: (u) => (model.upgrades[u.unlocked_by] || u.unlocked_by === undefined),
	    purchaseUpgrade: (upgrade) => model.purchaseUpgrade(upgrade),
	    startEncounter: (name, phase) => model.startEncounter(name, phase),
	    startEncounterSelection: () => model.startEncounterSelection(),
	    savePersistentState: () => model.savePersistentState(),
	    pass: () => model.pass(),
	    nextIcon: () => model.nextIcon(),
	    makeDudEntity: (typ) => model.makeDudEntity(typ),
	    entityValue: (typ) => (new typ()).value(),
	    toggleRosterEntity: (typ) => model.toggleRosterEntity(typ),
	    switchRosterIndex: (index) => model.switchRosterIndex(index),
	    curRosterIndex: () => model.curRosterIndex(),
	    toggleSound: () => model.toggleSound(),
	    soundIsOn: () => model.soundOn,
	}
    };
}

function storyModel() {
    var model = new AppModel(loadPersistentState());
    model.startEncounterSelection();
    return modelComponent(model);
}

function rootModel() {
    const r1 = new URLSearchParams(document.location.search).get("r1");
    if (! r1) return storyModel();
    const r2 = new URLSearchParams(document.location.search).get("r2");
    const upgradeIds = new URLSearchParams(document.location.search).get("up");
    var model = new AppModel(defaultPersistentState());
    if (upgradeIds) {
	for(const upgradeId of upgradeIds.split(',')) {
	    model.upgrades[upgradeId] = true;
	}
    }
    model.game.backgroundClass = 'sky-gradient-12';
    model.startGame(
	r1.split(',').map(getTypeByName),
	r2.split(',').map(getTypeByName),
	new SmartAi('ai'));
    return modelComponent(model);
}

function validate() {
    for(let chapterName of ORDERED_CHAPTERS) {
	for(let [encounter, number] of CHAPTERS[chapterName]) {
	    const options = encounter.options;
	    if (!options) throw new Error('encounter missing options in ' + chapterName);
	    if (options.libraryAward && !selectable_entities[options.libraryAward.typ.name])
		throw new Error('cannot find entity: ' + options.libraryAward.typ.name);
	}
    }
}
validate();
