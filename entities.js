// Idea scratch:
//  Chicken eggs produce things?
//  Zombie bites "zombify" targets?
//  Clockwork animals (gear)


// Base Classes

class Mage extends LivingEntity {}



//  Home Entities

class Leader extends LivingEntity {
    value() {
	return 1;
	// most of the leader value is accounted for in the
	// whole roster multiplier
    }
}

class Hero4 extends Leader {
    constructor() { super(4, 1, []); }
    getIconProps() {return {front: USMILE, back: USTAR};}
}

class Hero5 extends Leader {
    constructor() { super(5, 1, []); }
    getIconProps() {return {front: USMILE, back: USTAR};}
}

class Hero6 extends Leader {
    constructor() { super(6, 1, []); }
    getIconProps() {return {front: USMILE, back: USTAR};}
}

class Hero6M extends Leader {
    constructor() { super(6, 2, []); }
    getIconProps() {return {front: USMILE, back: USTAR};}
}

class Hero6A extends Leader {
    constructor() { super(6, 1, [new Slash(1)]); }
    getIconProps() {return {front: USMILE, back: USTAR};}
}

class Vilan4 extends Leader {
    constructor() { super(4, 1, []); }
    getIconProps() {return {front: UFROWN, back: USTAR};}
}

class Vilan5 extends Leader {
    constructor() { super(5, 1, []); }
    getIconProps() {return {front: UFROWN, back: USTAR};}
}

class Vilan6 extends Leader {
    constructor() { super(6, 1, []); }
    getIconProps() {return {front: UFROWN, back: USTAR};}
}

class Vilan6A extends Leader {
    constructor() { super(6, 1, [new Slash(1)]); }
    getIconProps() {return {front: UFROWN, back: USTAR};}
}

class Vilan6M extends Leader {
    constructor() { super(6, 2, []); }
    getIconProps() {return {front: UFROWN, back: USTAR};}
}

class Vilan6MA extends Leader {
    constructor() { super(6, 2, [new Slash(1)]); }
    getIconProps() {return {front: UFROWN, back: USTAR};}
}

class Vilan7A extends Leader {
    constructor() { super(7, 2, [new Slash(1)]); }
    getIconProps() {return {front: UFROWN, back: USTAR};}
}

class Vilan8MA extends Leader {
    constructor() { super(8, 2, [new Zap(1)]); }
    getIconProps() {return {front: UFROWN, back: USTAR};}
}

class Bug extends LivingEntity {
    constructor() { super(1, 1, [new Bite(1)]); }
    getIconProps() {return {front: UBUG};}
}

class Ant extends LivingEntity {
    constructor() { super(1, 1, [new Bite(1)]); }
    getIconProps() {return {front: UANT};}
}

class Duck extends LivingEntity {
    constructor() { super(2, 1, [new Bite(1)]); }
    getIconProps() {return {front: UDUCK};}
}

class OldTakeout extends LivingEntity {
    getIconProps() {return {front: UTAKEOUT};}
    constructor() { super(2, 0, [], {abilities:[new Spawn(Ant, UANT)]}); }
}

class ConstructionBarrier extends LivingEntity {
    getIconProps() {return {back: UCONSTRUCTION};}
    constructor() { super(3, 0, [], {blocker: true}); }
}

class Hole extends LivingEntity {
    getIconProps() {return {front: UHOLE};}
    constructor() { super(1, 0, [new Slash(1)]); }
}

class Cat extends LivingEntity {
    constructor() { super(3, 2, [new Bite(2)]); }
    getIconProps() {return {front: UCAT_FACE};}
}

class Dog extends LivingEntity {
    constructor() { super(4, 2, [new Bite(2)]); }
    getIconProps() {return {front: UDOG_FACE};}
}
    
class Rat extends LivingEntity {
    constructor() { super(2, 2, [new Bite(2)]); }
    getIconProps() { return {front: URAT}; }
}


// Yard Entities

class Rabbit extends LivingEntity {
    constructor() { super(2, 3, [new Bite(1)], {abilities:[new Spawn(Rabbit, URABBIT)]}); }
    getIconProps() { return {front: URABBIT}; }
}

class Bunny extends LivingEntity {
    constructor() {
	super(2, 3, [new Bite(0)], {
	    abilities:[new Engage(), new Spawn(Bunny, URABBIT)]
	});
    }
    getIconProps() { return {front: URABBIT}; }
}

class Turtle extends LivingEntity {
    constructor() { super(2, 1, [new Bite(1)], {slashArmor: 1}); }
    getIconProps() { return {front: UTURTLE}; }
}

class Snail extends LivingEntity {
    constructor() { super(1, 1, [new Bite(1)], {slashArmor: 1}); }
    getIconProps() { return {front: USNAIL}; }
}

class Bird extends LivingEntity {
    constructor() { super(2, 0, [new Bite(1)], {airMovement: 3}); }
    getIconProps() { return {front: UBIRD}; }
}

class Clover extends LivingEntity {
    constructor() {
	super(1, 0, [], {
	    abilities: [], // luck?
	});
    }
    getIconProps() { return {front: UCLOVER}; }
}

class Bee extends LivingEntity {
    constructor() { super(1, 0, [new Bite(2)], {airMovement: 1}); }
    getIconProps() { return {front: UBEE}; }
}

class Lizard extends LivingEntity {
    constructor() { super(1, 2, [new Bite(2)]); }
    getIconProps() { return {front: ULIZARD}; }
}

class Fountain extends LivingEntity {
    constructor() { super(2, 0, [], {slashArmor: 1, abilities:[new HealTarget(1)]}); }
    getIconProps() { return {front: UFOUNTAIN}; }
}

class Medic extends LivingEntity {
    constructor() { super(5, 2, [], {abilities:[new HealTarget(1)]}); }
    getIconProps() { return {front: UMEDIC}; }
}

// Office/Factory

class Angry extends LivingEntity {
    constructor() { super(3, 2, [new Bite(3)], {}) }
    getIconProps() { return {front: UANGRY}; }
}

class SpaceInvader extends LivingEntity {
    constructor() {
	super(1, 0, [], {
	    airMovement:2,
	    abilities:[new Engage(), new ZapProjectile(1)],
	});
    }
    getIconProps() { return {front: USPACE_INVADER}; }
}

class Robot extends LivingEntity {
    constructor() { super(1, 2, [new Zap(1)], {slashArmor:2}) }
    getIconProps() { return {front: UROBOT}; }
}

class Seat extends LivingEntity {
    constructor() { super(3, 0, [new Punch(1)], {blocker: true}) }
    getIconProps() { return {front: USEAT}; }
}

class FactoryWorker extends LivingEntity {
    constructor() {
	super(3, 2, [new Burn(1)], {
	    abilities: [new OneTime(new GrantArmor())],
	});
    }
    getIconProps() { return {front: UWOMAN+UJ+UFACTORY}; }
}

class KitchenKnife extends LivingEntity {
    constructor() { super(2, 0, [], {abilities:[new SacrificeTo(new GrantDamage(new Slash(1)))]}); }
    getIconProps() { return {front: UKITCHEN_KNIFE}; }
}


class FloatingMan extends LivingEntity {
    constructor() {
	super(3, 0, [new Punch(1)], {
	    airMovement: 1,
	    abilities: [new RefillTarget(), new RefillTarget()],
	});
    }
    getIconProps() { return {back: UFLOATING_MAN}; }
}

class Bomb extends LivingEntity {
    constructor() {
	super(1, 0, [], {
	    slashArmor: 1,
	    abilities: [ new SacrificeTo(new GlobalDamage(new Burn(1))) ],
	});
    }
    getIconProps() { return {front: UBOMB}; }
}


// Haunted Entities

class Zombie extends LivingEntity {
    getIconProps() {return {front: UZOMBIE};}
    constructor() { super(2, 1, [new Bite(2)]); }
}

class GiantZombie extends LivingEntity {
    getIconProps() {return {back: UZOMBIE};}
    constructor() { super(6, 1, [new Bite(3)]); }
}

class Skeleton extends LivingEntity {
    getName() { return USKULL; }
    getIconProps() {return {front: USKULL, back: UDAGGER};}
    constructor() { super(1, 1, [new Slash(2)], {slashArmor:1}); }
}

class Necromancer extends LivingEntity {
    getIconProps() { return {front: UWIZARD}; }
    constructor() {
	super(2, 2, [new Slash(1)], {
	    abilities:[new Spawn(Zombie, UZOMBIE)]
	});
    }
}

class SkeletonArcher extends LivingEntity {
    getName() { return USKULL; }
    getIconProps() {return {front: USKULL, back: UBOW};}
    constructor() { super(1, 1, [], {
	slashArmor: 1,
	abilities: [new Engage(), new PiercingProjectile(1)],
    }); }
}

class FireSkeleton extends LivingEntity {
    getName() { return USKULL; }
    getIconProps() {return {front: USKULL, back: UFIRE};}
    constructor() {
	super(2, 2, [new Slash(1)], {
	    abilities: [new FireProjectile(1)],
	    slashArmor: 1,
	    triggers: [new GainHeartOnDeath()],
	});
    }
}

// Undead Farm

class UndeadChicken extends LivingEntity {
    getIconProps() { return {front: UCHICKEN, back: UCASKET}; }
    constructor() { super(1, 1, [new Slash(1)], {abilities:[new Spawn(Zombie, UEGG)]}); }
}

// Store/shop/cafe

class GasPump extends LivingEntity {
    getIconProps() { return {front: UGAS_PUMP}; }
    constructor() {
	super(1, 0, [new Burn(2)], {
	    blocker: true
	});
    }
}

class Taco extends LivingEntity {
    getIconProps() { return {front: UTACO}; }
    constructor() { super(1, 1, [new Burn(1)]); }
}

class BurritoMan extends LivingEntity {
    getIconProps() { return {front: UEYES, back: UBURRITO}; }
    constructor() { super(3, 1, [new Burn(1)]); }
}

class HotDog extends LivingEntity {
    getIconProps() { return {front: UHOT_DOG}; }
    constructor() {
	super(1, 0, [], {
    	    abilities: [new SacrificeTo(new GrantDamage(new Poison(1)))],
	});
    }
}

class IceCream extends LivingEntity {
    getIconProps() { return {front: UICE_CREAM}; }
    constructor() {
	super(1, 0, [new Freeze()], {
    	    abilities: [new SacrificeTo(new RangedDamageAbility([new Freeze()]))],
	});
    }
}

class Kisser extends LivingEntity {
    getName() { return UKISSING; }
    constructor() {
	super(3, 2, [], {
	    abilities: [new Engage(), new Kiss()]
	});
    }
}

class CandyBar extends LivingEntity {
    getIconProps() { return {front: UCHOCOLATE_BAR}; }
    constructor() {
	super(1, 0, [], {
    	    abilities: [new SacrificeTo(new GrantMovement(1))],
	});
    }
}

class Soda extends LivingEntity {
    getIconProps() { return {front: UCUP_WITH_STRAW}; }
    constructor() {
	super(1, 0, [], {
    	    abilities: [new SacrificeTo(new GrantMovement(1))],
	});
    }
}

class Taunter extends LivingEntity {
    getName() { return UTONGUE_FACE; }
    constructor() {
	super(3, 1, [new Zap(1)], {
	    blocker: true
	});
    }
}

class ZanyPerson extends LivingEntity {
    getIconProps() { return {front: UZANY}; }
    constructor() {
	super(3, 3, []),
	this.abilities = [new Engage()];
    }
}

// Island or water

class Crab extends LivingEntity {
    getIconProps() { return {front: UCRAB}; }
    constructor() { super(1, 1, [new Bite(1)]); }
}

class Genie extends LivingEntity {
    getIconProps() { return {front: UWOMAN_GENIE}; }
    constructor() { super(1, 1, []); }
}

class StoneElemental extends LivingEntity {
    getIconProps() { return {front: UROCK_HEAD}; }
    constructor() { super(3, 1, [new Punch(2)], {
	abilities: [new Engage()],
	armor: 2
    }); }
}

// Forrest

class Mushroom extends LivingEntity {
    getIconProps() { return {front: UEYES, back: UMUSHROOM}; }
    constructor() {
	super(1, 1, [new Bite(1)], {
	    triggers: [new GainHeartOnDeath()],
	});
    }
}

class Chipmunk extends LivingEntity {
    getIconProps() { return {front: UNUT, back: UCHIPMUNK}; }
    constructor() {
	super(2, 2, [], {
	    abilities: [
		new Engage(),
    		new OneTime(new RangedDamageAbility([new Punch(1)])),
    		new OneTime(new RangedDamageAbility([new Punch(1)])),
		]
	});
    }
}

class Deer extends LivingEntity {
    getIconProps() { return {front: UDEER}; }
    constructor() { super(3, 4, [new Bite(1)], {}); }
}

class Elf extends LivingEntity {
    getIconProps() { return {front: UELF}; }
    constructor() {
	super(3, 3, [new Slash(1)], {abilities: [new PiercingProjectile(1)]});
    }
}

class BladeElf extends LivingEntity {
    getIconProps() { return {front: UELF+UJ+UFEMALE, back: UDAGGER}; }
    constructor() {
	super(3, 3, [new Slash(2)],
	      {abilities: [new PiercingProjectile(1)]});
    }
}

// Tent

class Owl extends LivingEntity {
    getIconProps() { return {front: UOWL}; }
    constructor() {
	super(2, 0, [new Bite(1)], {
	    airMovement: 2,
	    abilities: [new RefillSelf()],
	});
    }
}

class Bat extends LivingEntity {
    getIconProps() { return {front: UBAT}; }
    constructor() { super(2, 0, [new Bite(1)], {airMovement: 2}); }
}

class Spider extends LivingEntity {
    getIconProps() {return {front: USPIDER};}
    constructor() { super(1, 1, [], {abilities:[new Engage(), new ShootWeb()]}); }
}

class GiantSpider extends LivingEntity {
    getIconProps() {return {back: USPIDER};}
    constructor() { super(3, 1, [new Bite(1)], {abilities:[new AreaWeb()]}); }
}

class WolfRider extends LivingEntity {
    getIconProps() { return {front: UWOLF, back: UDAGGER}; }
    constructor() { super(2, 3, [new Lance()]); }
}

class RedGoblin extends LivingEntity {
    getIconProps() { return {front: URED_GOBLIN}; }
    constructor() { super(3, 3, [new Slash(2)]); }
}

class RedOgre extends LivingEntity {
    getIconProps() { return {back: URED_OGRE}; }
    constructor() { super(5, 2, [new Slash(3)]); }
}


// greek temple

class Goat extends LivingEntity {
    getIconProps() { return {front: UGOAT}; }
    constructor() {
	super(3, 2, [new Bite(1)]);
    }
}

class Wine extends LivingEntity {
    getIconProps() { return {front: UWINE_GLASS}; }
    constructor() {
	super(1, 0, [], {
	    abilities: [new SacrificeTo(new GlobalRemoveMovement())]
	});
    }
}

class Imp extends LivingEntity {
    getIconProps() { return {front: UPURPLE_IMP, back: UDAGGER}; }
    constructor() { super(2, 3, [new Slash(2)], {
	abilities: [new SacrificeTo(new GrantDamage(new Slash(1)))],
    }); }
}

class FlyingImp extends LivingEntity {
    getIconProps() { return {front: UPURPLE_IMP, back: UBUTTERFLY}; }
    constructor() { super(2, 0, [new Slash(1)], {
	airMovement: 3,
	abilities: [new SacrificeTo(new GrantAirMovement(1))],
    }); }
}

class ArmoredImp extends LivingEntity {
    getIconProps() { return {front: UPURPLE_IMP, back: USHIELD}; }
    constructor() { super(2, 3, [new Slash(1)], {
	abilities: [new SacrificeTo(new GrantArmor())],
	slashArmor: 1,
    }); }
}

class Doppelganger extends LivingEntity {
    getIconProps() { return {front: UPERSON}; }
    constructor() {
	super(1, 2, [], {
	    abilities: [new Engage(), new Masquerade()],
	});
    }
}

class Zeus extends LivingEntity {
    getIconProps() { return {front: UELECTRIC, back: UTRIDENT}; }
    constructor() { super(6, 2, [new Slash(2)], {
	abilities: [new ZapProjectile(2)],
    }); }
}

// Mountain

class Ram extends LivingEntity {
    getIconProps() { return {front: URAM}; }
    constructor() {
	super(3, 3, [new Punch(2)]);
    }
}

class StormCloud extends LivingEntity {
    getIconProps() { return {front: URAIN_CLOUD}; }
    constructor() {
	super(1, 0, [], {
	    abilities: [new SacrificeTo(new GlobalWeb())]
	});
    }
}

class Miner extends LivingEntity {
    getName() { return UBEARD_MAN; }
    constructor() {
	super(2, 2, [new Slash(1)], {
	    abilities: [new Placeholder(UPICK)],
	});
    }
}

class WindElemental extends LivingEntity {
    getIconProps() { return {front: UFACE_BLOWING}; }
    constructor() {
	super(2, 0, [], {
	    airMovement: 3,
	    abilities: [new Engage(), new Tornado(2)],
	});
    }
}

class IceMan extends LivingEntity {
    getIconProps() { return {front: UPERSON, back: UICE}; }
    constructor() {
	super(4, 1, [new Slash(1)], {
	    abilities: [new FreezeProjectile()],
	});
    }
}

class EagleRider extends LivingEntity {
    getIconProps() {return {front: UEAGLE, back: UDAGGER};}
    constructor() {
	super(3, 0, [new Lance()], {
	    airMovement: 3,
	});
    }
}

class Cupid extends LivingEntity {
    getIconProps() { return {front: UCHERUB}; }
    constructor() {
	super(1, 0, [], {
	    airMovement: 1,
	    abilities: [new Engage(), new Charm(UHEART_ARROW)],
	});
	this.abilities[0].used = true;
    }
}

class Dragon extends LivingEntity {
    getIconProps() {return {back: UDRAGON};}
    constructor() {
	super(7, 2, [new Bite(3)], {
	    abilities:[new AreaDamage(new Burn(1))],
	    slashArmor:1,
	    airMovement:3
	});
    }
}

class Poop extends LivingEntity {
    getIconProps() {return {back: UPOOP};}
    constructor() {
	super(7, 2, [new Bite(3)], {
	    abilities:[new AreaDamage(new Burn(1))],
	    slashArmor:1,
	    airMovement:3
	});
    }
}

// EU castle

class Guard extends LivingEntity {
    getIconProps() { return {front: UFLEUR_DE_LIS}; }
    constructor() { super(3, 2, [new Slash(1)], {blocker: true}); }
}

class Archers extends LivingEntity {
    getIconProps() { return {front: UBOW, back: UBOW}; }
    constructor() {
	super(2, 0, [], {
	    abilities:[new AreaDamage(new Slash(1))]
	});
    }
}

class Knight extends LivingEntity {
    getIconProps() {return {front: UHORSE_FACE, back: UDAGGER};}
    constructor() { super(2, 3, [new Lance()], {slashArmor:1}); }
}

class ElementalMage extends Mage {
    getIconProps() { return {front: UWIZARD}; }
    constructor() {
	super(2, 2, [], {abilities:[
	    new Engage(),
	    new FireProjectile(2),
	    new FreezeProjectile(),
	]});
    }
}

class King extends LivingEntity {
    getIconProps() { return {front: UCROWN}; }
    constructor() {
	super(3, 2, [new Slash(1)], {
	    abilities: [new RefillTarget()]
	});
    }
}

class ElectroMage extends Mage {
    getIconProps() { return {front: UWIZARD, back: UELECTRIC}; }
    constructor() {
	super(2, 2, [new Zap(2)], {
	    abilities:[new ZapProjectile(1)],
	});
    }
}

class ShieldMage extends Mage {
    getIconProps() { return {front: UWIZARD, back: UBLUE_DOT}; }
    constructor() {
	super(2, 2, [], {
	    abilities:[
		new Engage(),
		new Placeholder(UBLUE_DOT)
	    ],
	});
    }
}

class Seer extends Mage {
    getIconProps() { return {front: UWIZARD}; }
    constructor() {
	super(2, 2, [], {abilities:[
	    new Engage(),
	    new Placeholder(UCRYSTAL_BALL),
	]});
    }
}


// JP castle

class CherryBlossum extends LivingEntity {
    getIconProps() { return {front: UCHERRY_BLOSSOM}; }
    constructor() { super(1, 0, [], {
	abilities: [new SacrificeTo(new GrantDamage(new Punch(1)))]
    }); }
}

class Cricket extends LivingEntity {
    getIconProps() { return {front: UCRICKET}; }
    constructor() {
	super(1, 2, [new Bite(1)], {
	    airMovement: 2,
	});
    }
}

class Squid extends LivingEntity {
    getIconProps() { return {front: USQUID}; }
    constructor() {
	super(4, 3, [], {
    	    abilities: [new Engage(), new RangedDamageAbility([new Freeze()])],
	});
    }
}

class BentoBox extends LivingEntity {
    constructor() { super(3, 0, [], {abilities:[
    	new OneTime(new HealTarget(1, USUSHI)),
    	new OneTime(new HealTarget(1, URICE_BALL)),
    	new OneTime(new HealTarget(1, UFRIED_SHRIMP)),
    ]}); }
    getIconProps() { return {front: UBENTO_BOX}; }
}

class StoutNinja extends LivingEntity {
    getIconProps() { return {front: UPANDA_FACE, back: UMARTIAL_ARTS_ROBE}; }
    constructor() {
	super(4, 2, [new Punch(1)], {
	    abilities: [new OneTime(new AreaGrantHp())],
	});
    }
}

class Ninja extends LivingEntity {
    getIconProps() { return {front: UMARTIAL_ARTS_ROBE}; }
    constructor() { super(3, 4, [new Punch(2)], {}); }
}

class GiantNinja extends LivingEntity {
    getIconProps() { return {front: UCROSSED_SWORDS, back: UMARTIAL_ARTS_ROBE}; }
    constructor() {
	super(4, 3, [new Slash(2)], {
	    abilities: [new RefillSelf()]
	});
    }
}

class PandaNinja extends LivingEntity {
    getIconProps() { return {front: UPANDA_FACE, back: UMARTIAL_ARTS_ROBE}; }
    constructor() { super(5, 2, [new Punch(2)], {}); }
}


// Other entities

class Violin extends LivingEntity {
    getIconProps() {return {front: UVIOLIN, back: UZZZ};}
    constructor() {
	super(1, 0, [], {
	    abilities: [new GlobalSleep()],
	});
    }
}

class Beholder extends LivingEntity {
    getIconProps() {return {front: UEYES, back: UBRAIN};}
    constructor() {
	super(3, 0, [new Bite(1)], {
	    abilities: [new OneTime(new ZapProjectile(1))],
	    airMovement: 2,
	});
    }
}

class Bandit extends LivingEntity {
    getName() { return '\u{1F9DD}'; }
    constructor() { super(2, 3, [new Slash(2)], {}); }
}

class VolcanoGod extends LivingEntity {
    getIconProps() { return {back: URED_ANGRY}; }
    constructor() {
	super(5, 1, [new Punch(2)], {
	    abilities: [new Quake()],
	});
    }
}

class SnakeMan extends LivingEntity {
    getIconProps() {return {back: USNAKE, front: UHANDS};}
    constructor() { super(5, 1, [new Punch(2)]); }
}

// gym?

class Thug extends LivingEntity {
    getName() { return USTRONG; }
    constructor() { super(4, 2, [new Punch(1)], {}); }
}


selectable_entities = {
    Bug, 
    Ant,
    Duck,
    OldTakeout,
    ConstructionBarrier,
    //Hole,
    Cat,
    Dog,
    Rat,
    Kisser,
    Rabbit,
    Turtle,
    Snail,
    Bird,
    //Clover,
    Bee,
    Lizard,
    Fountain,
    //Medic,
    Angry,
    SpaceInvader,
    Robot,
    //Seat,
    FactoryWorker,
    KitchenKnife,
    FloatingMan,
    Bomb,
    GasPump,
    Zombie,
    GiantZombie,
    Skeleton,
    Necromancer,
    SkeletonArcher,
    FireSkeleton,
    //UndeadChicken,
    //Taco,
    BurritoMan,
    HotDog,
    IceCream,
    //CandyBar,
    Soda,
    //Crab,
    //Genie,
    //StoneElemental,
    Mushroom,
    Chipmunk,
    Deer,
    Elf,
    BladeElf,
    Owl,
    Bat,
    Spider,
    GiantSpider,
    WolfRider,
    RedGoblin,
    RedOgre,
    Goat,
    Wine,
    Imp,
    FlyingImp,
    ArmoredImp,
    Doppelganger,
    Zeus,
    Ram,
    StormCloud,
    //Miner,
    WindElemental,
    IceMan,
    EagleRider,
    Cupid,
    Dragon,
    Guard,
    Archers,
    Knight,
    ElementalMage,
    //King,
    ElectroMage,
    //ShieldMage,
    //Seer,
    CherryBlossum,
    Cricket,
    Squid,
    BentoBox,
    Ninja,
    StoutNinja,
    GiantNinja,
    //PandaNinja,
    Violin,
    //Beholder,
    //Bandit,
    //VolcanoGod,
    //SnakeMan,
    Taunter,
    //Thug,
};

all_entities = {
    Hero4,
    Hero5,
    Hero6,
    Hero6A,
    Hero6M,
    Vilan4,
    Vilan5,
    Vilan6,
    Vilan6M,
    Vilan6A,
    Vilan6MA,
    Vilan7A,
    Vilan8MA,
	...selectable_entities
};

function getTypeByName(name) {
    const typ = all_entities[name];
    if (! typ) {
	throw new Error('Unknown entity type: '+name);
    }
    return typ;
}

