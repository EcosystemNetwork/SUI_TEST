/// Character Minter Module
/// Dungeons & Dragons × Warhammer 40K Fusion NFT Character System
///
/// This module implements an NFT character minting system that fuses
/// D&D high fantasy with Warhammer 40K grimdark sci-fi aesthetics.
module character_minter::character {
    use std::string::{Self, String};
    use sui::event;
    use sui::package;
    use sui::display;

    // ===== Error Codes =====
    const EInvalidArchetype: u64 = 0;
    const EInvalidRace: u64 = 1;
    const EInvalidAllegiance: u64 = 2;
    const EInvalidArmorTier: u64 = 3;
    const ECorruptionOverflow: u64 = 4;
    const EPurityOverflow: u64 = 5;
    const EStatOverflow: u64 = 6;

    // ===== Constants =====

    // Archetypes
    const ARCHETYPE_VOID_PALADIN: u8 = 0;
    const ARCHETYPE_TECHNO_CLERIC: u8 = 1;
    const ARCHETYPE_PSYKER_SORCERER: u8 = 2;
    const ARCHETYPE_GENE_ENHANCED_BARBARIAN: u8 = 3;
    const ARCHETYPE_CYBER_NECROMANCER: u8 = 4;
    const ARCHETYPE_WARP_ASSASSIN: u8 = 5;
    const ARCHETYPE_COUNT: u8 = 6;

    // Races
    const RACE_AUGMENTED_HUMAN: u8 = 0;
    const RACE_VOID_ELF: u8 = 1;
    const RACE_CHAOS_TOUCHED_MUTANT: u8 = 2;
    const RACE_BIO_ENGINEERED_KNIGHT: u8 = 3;
    const RACE_MACHINE_BOUND_UNDEAD: u8 = 4;
    const RACE_COUNT: u8 = 5;

    // Allegiances
    const ALLEGIANCE_ORDER: u8 = 0;
    const ALLEGIANCE_CHAOS: u8 = 1;
    const ALLEGIANCE_NEUTRAL: u8 = 2;
    const ALLEGIANCE_COUNT: u8 = 3;

    // Armor Tiers
    const ARMOR_RELIC: u8 = 0;
    const ARMOR_SANCTIFIED: u8 = 1;
    const ARMOR_CORRUPTED: u8 = 2;
    const ARMOR_HERETICAL: u8 = 3;
    const ARMOR_TIER_COUNT: u8 = 4;

    // Stat bounds
    const MAX_STAT_VALUE: u64 = 100;
    const MAX_CORRUPTION: u64 = 100;
    const MAX_PURITY: u64 = 100;

    // ===== One-Time Witness =====
    public struct CHARACTER has drop {}

    // ===== Structs =====

    /// Represents the stats of a character
    public struct CharacterStats has store, copy, drop {
        strength: u64,
        faith: u64,
        psy_power: u64,
        machine_affinity: u64,
        corruption: u64,
        luck: u64,
    }

    /// The main Character NFT object
    public struct Character has key, store {
        id: UID,
        name: String,
        archetype: u8,
        race: u8,
        allegiance: u8,
        armor_tier: u8,
        stats: CharacterStats,
        corruption_level: u64,
        purity_level: u64,
        origin_lore: String,
        image_url: String,
        mutation_count: u64,
    }

    /// Admin capability for managing the minter
    public struct MinterAdmin has key, store {
        id: UID,
    }

    /// Tracks global minting statistics
    public struct MintRegistry has key {
        id: UID,
        total_minted: u64,
    }

    // ===== Events =====

    public struct CharacterMinted has copy, drop {
        character_id: ID,
        name: String,
        archetype: u8,
        race: u8,
        allegiance: u8,
        minter: address,
    }

    public struct CharacterMutated has copy, drop {
        character_id: ID,
        old_corruption: u64,
        new_corruption: u64,
        mutation_count: u64,
    }

    // ===== Init =====

    fun init(otw: CHARACTER, ctx: &mut TxContext) {
        // Create display for Character NFTs
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"project_url"),
        ];

        let values = vector[
            string::utf8(b"{name}"),
            string::utf8(b"A grimdark character from the D&D x Warhammer 40K fusion universe. Archetype: {archetype}, Race: {race}"),
            string::utf8(b"{image_url}"),
            string::utf8(b"https://character-minter.sui"),
        ];

        let publisher = package::claim(otw, ctx);
        let mut display = display::new_with_fields<Character>(
            &publisher, keys, values, ctx
        );
        display::update_version(&mut display);

        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(display, ctx.sender());

        // Create admin capability
        transfer::transfer(MinterAdmin {
            id: object::new(ctx),
        }, ctx.sender());

        // Create mint registry
        transfer::share_object(MintRegistry {
            id: object::new(ctx),
            total_minted: 0,
        });
    }

    // ===== Public Functions =====

    /// Mint a new character NFT
    public entry fun mint_character(
        registry: &mut MintRegistry,
        name: vector<u8>,
        archetype: u8,
        race: u8,
        allegiance: u8,
        armor_tier: u8,
        corruption_level: u64,
        purity_level: u64,
        origin_lore: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext,
    ) {
        assert!(archetype < ARCHETYPE_COUNT, EInvalidArchetype);
        assert!(race < RACE_COUNT, EInvalidRace);
        assert!(allegiance < ALLEGIANCE_COUNT, EInvalidAllegiance);
        assert!(armor_tier < ARMOR_TIER_COUNT, EInvalidArmorTier);
        assert!(corruption_level <= MAX_CORRUPTION, ECorruptionOverflow);
        assert!(purity_level <= MAX_PURITY, EPurityOverflow);

        // Generate pseudo-random stats based on tx context
        let uid = object::new(ctx);
        let id_bytes = object::uid_to_bytes(&uid);
        let stats = generate_stats(&id_bytes, archetype);

        let character_name = string::utf8(name);

        let character = Character {
            id: uid,
            name: character_name,
            archetype,
            race,
            allegiance,
            armor_tier,
            stats,
            corruption_level,
            purity_level,
            origin_lore: string::utf8(origin_lore),
            image_url: string::utf8(image_url),
            mutation_count: 0,
        };

        let character_id = object::id(&character);

        event::emit(CharacterMinted {
            character_id,
            name: character.name,
            archetype,
            race,
            allegiance,
            minter: ctx.sender(),
        });

        registry.total_minted = registry.total_minted + 1;

        transfer::transfer(character, ctx.sender());
    }

    /// Mutate a character — increases corruption and tracks mutations
    public entry fun mutate_character(
        character: &mut Character,
        corruption_increase: u64,
    ) {
        let old_corruption = character.corruption_level;
        let new_corruption = character.corruption_level + corruption_increase;

        assert!(new_corruption <= MAX_CORRUPTION, ECorruptionOverflow);

        character.corruption_level = new_corruption;

        // Decrease purity proportionally
        if (character.purity_level >= corruption_increase) {
            character.purity_level = character.purity_level - corruption_increase;
        } else {
            character.purity_level = 0;
        };

        character.mutation_count = character.mutation_count + 1;

        event::emit(CharacterMutated {
            character_id: object::id(character),
            old_corruption,
            new_corruption,
            mutation_count: character.mutation_count,
        });
    }

    /// Purify a character — decreases corruption and increases purity
    public entry fun purify_character(
        character: &mut Character,
        purity_increase: u64,
    ) {
        let new_purity = character.purity_level + purity_increase;
        assert!(new_purity <= MAX_PURITY, EPurityOverflow);

        character.purity_level = new_purity;

        if (character.corruption_level >= purity_increase) {
            character.corruption_level = character.corruption_level - purity_increase;
        } else {
            character.corruption_level = 0;
        };
    }

    /// Update character allegiance
    public entry fun update_allegiance(
        character: &mut Character,
        new_allegiance: u8,
    ) {
        assert!(new_allegiance < ALLEGIANCE_COUNT, EInvalidAllegiance);
        character.allegiance = new_allegiance;
    }

    /// Upgrade armor tier (admin only)
    public entry fun upgrade_armor(
        _admin: &MinterAdmin,
        character: &mut Character,
        new_tier: u8,
    ) {
        assert!(new_tier < ARMOR_TIER_COUNT, EInvalidArmorTier);
        character.armor_tier = new_tier;
    }

    // ===== View Functions =====

    public fun get_name(character: &Character): &String { &character.name }
    public fun get_archetype(character: &Character): u8 { character.archetype }
    public fun get_race(character: &Character): u8 { character.race }
    public fun get_allegiance(character: &Character): u8 { character.allegiance }
    public fun get_armor_tier(character: &Character): u8 { character.armor_tier }
    public fun get_stats(character: &Character): &CharacterStats { &character.stats }
    public fun get_corruption(character: &Character): u64 { character.corruption_level }
    public fun get_purity(character: &Character): u64 { character.purity_level }
    public fun get_mutation_count(character: &Character): u64 { character.mutation_count }
    public fun get_total_minted(registry: &MintRegistry): u64 { registry.total_minted }

    public fun get_stat_strength(stats: &CharacterStats): u64 { stats.strength }
    public fun get_stat_faith(stats: &CharacterStats): u64 { stats.faith }
    public fun get_stat_psy_power(stats: &CharacterStats): u64 { stats.psy_power }
    public fun get_stat_machine_affinity(stats: &CharacterStats): u64 { stats.machine_affinity }
    public fun get_stat_corruption(stats: &CharacterStats): u64 { stats.corruption }
    public fun get_stat_luck(stats: &CharacterStats): u64 { stats.luck }

    // ===== Helper Functions =====

    /// Generate pseudo-random stats based on object ID bytes and archetype bonuses
    fun generate_stats(id_bytes: &vector<u8>, archetype: u8): CharacterStats {
        let len = id_bytes.length();

        let base_str = if (len > 0) { (*id_bytes.borrow(0) as u64) % 80 + 10 } else { 50 };
        let base_faith = if (len > 1) { (*id_bytes.borrow(1) as u64) % 80 + 10 } else { 50 };
        let base_psy = if (len > 2) { (*id_bytes.borrow(2) as u64) % 80 + 10 } else { 50 };
        let base_machine = if (len > 3) { (*id_bytes.borrow(3) as u64) % 80 + 10 } else { 50 };
        let base_corruption = if (len > 4) { (*id_bytes.borrow(4) as u64) % 50 } else { 25 };
        let base_luck = if (len > 5) { (*id_bytes.borrow(5) as u64) % 80 + 10 } else { 50 };

        // Apply archetype bonuses
        let (str_bonus, faith_bonus, psy_bonus, machine_bonus) = get_archetype_bonuses(archetype);

        let strength = min(base_str + str_bonus, MAX_STAT_VALUE);
        let faith = min(base_faith + faith_bonus, MAX_STAT_VALUE);
        let psy_power = min(base_psy + psy_bonus, MAX_STAT_VALUE);
        let machine_affinity = min(base_machine + machine_bonus, MAX_STAT_VALUE);

        CharacterStats {
            strength,
            faith,
            psy_power,
            machine_affinity,
            corruption: base_corruption,
            luck: base_luck,
        }
    }

    /// Get stat bonuses based on archetype
    fun get_archetype_bonuses(archetype: u8): (u64, u64, u64, u64) {
        if (archetype == ARCHETYPE_VOID_PALADIN) {
            (10, 15, 0, 5)       // Str + Faith focused
        } else if (archetype == ARCHETYPE_TECHNO_CLERIC) {
            (0, 10, 5, 15)       // Faith + Machine focused
        } else if (archetype == ARCHETYPE_PSYKER_SORCERER) {
            (0, 5, 20, 0)        // Psy Power focused
        } else if (archetype == ARCHETYPE_GENE_ENHANCED_BARBARIAN) {
            (20, 0, 0, 5)        // Strength focused
        } else if (archetype == ARCHETYPE_CYBER_NECROMANCER) {
            (0, 0, 10, 15)       // Psy + Machine focused
        } else {
            // ARCHETYPE_WARP_ASSASSIN
            (10, 0, 10, 5)       // Str + Psy focused
        }
    }

    fun min(a: u64, b: u64): u64 {
        if (a < b) { a } else { b }
    }

    // ===== Archetype name helpers =====

    public fun archetype_name(archetype: u8): String {
        if (archetype == ARCHETYPE_VOID_PALADIN) {
            string::utf8(b"Void Paladin")
        } else if (archetype == ARCHETYPE_TECHNO_CLERIC) {
            string::utf8(b"Techno-Cleric")
        } else if (archetype == ARCHETYPE_PSYKER_SORCERER) {
            string::utf8(b"Psyker Sorcerer")
        } else if (archetype == ARCHETYPE_GENE_ENHANCED_BARBARIAN) {
            string::utf8(b"Gene-Enhanced Barbarian")
        } else if (archetype == ARCHETYPE_CYBER_NECROMANCER) {
            string::utf8(b"Cyber-Necromancer")
        } else {
            string::utf8(b"Warp Assassin")
        }
    }

    public fun race_name(race: u8): String {
        if (race == RACE_AUGMENTED_HUMAN) {
            string::utf8(b"Augmented Human")
        } else if (race == RACE_VOID_ELF) {
            string::utf8(b"Void Elf")
        } else if (race == RACE_CHAOS_TOUCHED_MUTANT) {
            string::utf8(b"Chaos-Touched Mutant")
        } else if (race == RACE_BIO_ENGINEERED_KNIGHT) {
            string::utf8(b"Bio-Engineered Knight")
        } else {
            string::utf8(b"Machine-Bound Undead")
        }
    }

    public fun allegiance_name(allegiance: u8): String {
        if (allegiance == ALLEGIANCE_ORDER) {
            string::utf8(b"Order")
        } else if (allegiance == ALLEGIANCE_CHAOS) {
            string::utf8(b"Chaos")
        } else {
            string::utf8(b"Neutral")
        }
    }

    public fun armor_tier_name(tier: u8): String {
        if (tier == ARMOR_RELIC) {
            string::utf8(b"Relic")
        } else if (tier == ARMOR_SANCTIFIED) {
            string::utf8(b"Sanctified")
        } else if (tier == ARMOR_CORRUPTED) {
            string::utf8(b"Corrupted")
        } else {
            string::utf8(b"Heretical")
        }
    }

    // ===== Test Helpers =====
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(CHARACTER {}, ctx);
    }
}
