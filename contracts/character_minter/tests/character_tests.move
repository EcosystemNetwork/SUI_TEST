/// Tests for the Character Minter module
#[test_only]
module character_minter::character_tests {
    use character_minter::character;
    use sui::test_scenario;

    const ADMIN: address = @0xAD;
    const USER: address = @0xB0B;

    #[test]
    fun test_mint_character() {
        let mut scenario = test_scenario::begin(ADMIN);

        // Init the module
        {
            character::init_for_testing(scenario.ctx());
        };

        // Mint a character as user
        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();

            character::mint_character(
                &mut registry,
                b"Kael the Void Paladin",
                0, // Void Paladin
                0, // Augmented Human
                0, // Order
                0, // Relic armor
                10, // corruption
                80, // purity
                b"Born in the void between stars",
                b"https://example.com/kael.png",
                scenario.ctx(),
            );

            assert!(character::get_total_minted(&registry) == 1);
            test_scenario::return_shared(registry);
        };

        // Verify the character was created
        scenario.next_tx(USER);
        {
            let character = scenario.take_from_sender<character::Character>();

            assert!(character::get_archetype(&character) == 0); // Void Paladin
            assert!(character::get_race(&character) == 0); // Augmented Human
            assert!(character::get_allegiance(&character) == 0); // Order
            assert!(character::get_armor_tier(&character) == 0); // Relic
            assert!(character::get_corruption(&character) == 10);
            assert!(character::get_purity(&character) == 80);
            assert!(character::get_mutation_count(&character) == 0);

            scenario.return_to_sender(character);
        };

        scenario.end();
    }

    #[test]
    fun test_mint_all_archetypes() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        // Mint one of each archetype
        let mut i: u8 = 0;
        while (i < 6) {
            scenario.next_tx(USER);
            {
                let mut registry = scenario.take_shared<character::MintRegistry>();
                character::mint_character(
                    &mut registry,
                    b"Test Character",
                    i,
                    0,
                    0,
                    0,
                    0,
                    50,
                    b"Test origin",
                    b"https://example.com/test.png",
                    scenario.ctx(),
                );
                test_scenario::return_shared(registry);
            };
            i = i + 1;
        };

        // Verify all 6 were minted
        scenario.next_tx(USER);
        {
            let registry = scenario.take_shared<character::MintRegistry>();
            assert!(character::get_total_minted(&registry) == 6);
            test_scenario::return_shared(registry);
        };

        scenario.end();
    }

    #[test]
    fun test_mutate_character() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        // Mint a character
        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();
            character::mint_character(
                &mut registry,
                b"Mutant Warrior",
                4, // Cyber-Necromancer
                2, // Chaos-Touched Mutant
                1, // Chaos
                2, // Corrupted armor
                20,
                60,
                b"Touched by the warp",
                b"https://example.com/mutant.png",
                scenario.ctx(),
            );
            test_scenario::return_shared(registry);
        };

        // Mutate the character
        scenario.next_tx(USER);
        {
            let mut character = scenario.take_from_sender<character::Character>();

            character::mutate_character(&mut character, 15);

            assert!(character::get_corruption(&character) == 35); // 20 + 15
            assert!(character::get_purity(&character) == 45);     // 60 - 15
            assert!(character::get_mutation_count(&character) == 1);

            scenario.return_to_sender(character);
        };

        scenario.end();
    }

    #[test]
    fun test_purify_character() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        // Mint a character
        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();
            character::mint_character(
                &mut registry,
                b"Fallen Knight",
                0, // Void Paladin
                3, // Bio-Engineered Knight
                2, // Neutral
                1, // Sanctified
                50,
                30,
                b"A knight seeking redemption",
                b"https://example.com/knight.png",
                scenario.ctx(),
            );
            test_scenario::return_shared(registry);
        };

        // Purify the character
        scenario.next_tx(USER);
        {
            let mut character = scenario.take_from_sender<character::Character>();

            character::purify_character(&mut character, 20);

            assert!(character::get_corruption(&character) == 30); // 50 - 20
            assert!(character::get_purity(&character) == 50);     // 30 + 20

            scenario.return_to_sender(character);
        };

        scenario.end();
    }

    #[test]
    fun test_update_allegiance() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();
            character::mint_character(
                &mut registry,
                b"Turncoat",
                5, // Warp Assassin
                1, // Void Elf
                0, // Order
                0,
                10,
                80,
                b"An elf who turned to chaos",
                b"https://example.com/turncoat.png",
                scenario.ctx(),
            );
            test_scenario::return_shared(registry);
        };

        // Change allegiance to Chaos
        scenario.next_tx(USER);
        {
            let mut character = scenario.take_from_sender<character::Character>();

            assert!(character::get_allegiance(&character) == 0); // Order
            character::update_allegiance(&mut character, 1);     // Change to Chaos
            assert!(character::get_allegiance(&character) == 1); // Chaos

            scenario.return_to_sender(character);
        };

        scenario.end();
    }

    #[test]
    fun test_upgrade_armor() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();
            character::mint_character(
                &mut registry,
                b"Armored One",
                1, // Techno-Cleric
                0,
                0,
                0, // Relic
                0,
                100,
                b"A cleric in relic armor",
                b"https://example.com/armored.png",
                scenario.ctx(),
            );
            test_scenario::return_shared(registry);
        };

        // Upgrade armor (as admin)
        scenario.next_tx(ADMIN);
        {
            let admin = scenario.take_from_sender<character::MinterAdmin>();
            let mut character = scenario.take_from_address<character::Character>(USER);

            assert!(character::get_armor_tier(&character) == 0); // Relic
            character::upgrade_armor(&admin, &mut character, 1); // Sanctified
            assert!(character::get_armor_tier(&character) == 1); // Sanctified

            test_scenario::return_to_address(USER, character);
            scenario.return_to_sender(admin);
        };

        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = character::EInvalidArchetype)]
    fun test_invalid_archetype() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();
            character::mint_character(
                &mut registry,
                b"Invalid",
                99, // Invalid archetype
                0, 0, 0, 0, 0,
                b"",
                b"",
                scenario.ctx(),
            );
            test_scenario::return_shared(registry);
        };

        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = character::EInvalidRace)]
    fun test_invalid_race() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();
            character::mint_character(
                &mut registry,
                b"Invalid",
                0,
                99, // Invalid race
                0, 0, 0, 0,
                b"",
                b"",
                scenario.ctx(),
            );
            test_scenario::return_shared(registry);
        };

        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = character::ECorruptionOverflow)]
    fun test_corruption_overflow() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();
            character::mint_character(
                &mut registry,
                b"Too Corrupt",
                0, 0, 0, 0,
                101, // Over max corruption
                0,
                b"",
                b"",
                scenario.ctx(),
            );
            test_scenario::return_shared(registry);
        };

        scenario.end();
    }

    #[test]
    fun test_name_helpers() {
        assert!(character::archetype_name(0) == std::string::utf8(b"Void Paladin"));
        assert!(character::archetype_name(1) == std::string::utf8(b"Techno-Cleric"));
        assert!(character::archetype_name(2) == std::string::utf8(b"Psyker Sorcerer"));
        assert!(character::archetype_name(3) == std::string::utf8(b"Gene-Enhanced Barbarian"));
        assert!(character::archetype_name(4) == std::string::utf8(b"Cyber-Necromancer"));
        assert!(character::archetype_name(5) == std::string::utf8(b"Warp Assassin"));

        assert!(character::race_name(0) == std::string::utf8(b"Augmented Human"));
        assert!(character::race_name(1) == std::string::utf8(b"Void Elf"));
        assert!(character::race_name(2) == std::string::utf8(b"Chaos-Touched Mutant"));
        assert!(character::race_name(3) == std::string::utf8(b"Bio-Engineered Knight"));
        assert!(character::race_name(4) == std::string::utf8(b"Machine-Bound Undead"));

        assert!(character::allegiance_name(0) == std::string::utf8(b"Order"));
        assert!(character::allegiance_name(1) == std::string::utf8(b"Chaos"));
        assert!(character::allegiance_name(2) == std::string::utf8(b"Neutral"));

        assert!(character::armor_tier_name(0) == std::string::utf8(b"Relic"));
        assert!(character::armor_tier_name(1) == std::string::utf8(b"Sanctified"));
        assert!(character::armor_tier_name(2) == std::string::utf8(b"Corrupted"));
        assert!(character::armor_tier_name(3) == std::string::utf8(b"Heretical"));
    }

    #[test]
    fun test_stats_within_bounds() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();
            character::mint_character(
                &mut registry,
                b"Stats Test",
                2, // Psyker Sorcerer (high psy bonus)
                0, 0, 0, 0, 50,
                b"Testing stats",
                b"https://example.com/stats.png",
                scenario.ctx(),
            );
            test_scenario::return_shared(registry);
        };

        scenario.next_tx(USER);
        {
            let character = scenario.take_from_sender<character::Character>();
            let stats = character::get_stats(&character);

            // All stats should be within [0, 100]
            assert!(character::get_stat_strength(stats) <= 100);
            assert!(character::get_stat_faith(stats) <= 100);
            assert!(character::get_stat_psy_power(stats) <= 100);
            assert!(character::get_stat_machine_affinity(stats) <= 100);
            assert!(character::get_stat_corruption(stats) <= 100);
            assert!(character::get_stat_luck(stats) <= 100);

            scenario.return_to_sender(character);
        };

        scenario.end();
    }

    #[test]
    fun test_multiple_mutations() {
        let mut scenario = test_scenario::begin(ADMIN);

        {
            character::init_for_testing(scenario.ctx());
        };

        scenario.next_tx(USER);
        {
            let mut registry = scenario.take_shared<character::MintRegistry>();
            character::mint_character(
                &mut registry,
                b"Multi Mutant",
                3, 2, 1, 2,
                0, // Start with 0 corruption
                100, // Full purity
                b"Starting pure",
                b"https://example.com/multi.png",
                scenario.ctx(),
            );
            test_scenario::return_shared(registry);
        };

        // Apply 3 mutations
        scenario.next_tx(USER);
        {
            let mut character = scenario.take_from_sender<character::Character>();

            character::mutate_character(&mut character, 10);
            assert!(character::get_mutation_count(&character) == 1);
            assert!(character::get_corruption(&character) == 10);
            assert!(character::get_purity(&character) == 90);

            character::mutate_character(&mut character, 20);
            assert!(character::get_mutation_count(&character) == 2);
            assert!(character::get_corruption(&character) == 30);
            assert!(character::get_purity(&character) == 70);

            character::mutate_character(&mut character, 30);
            assert!(character::get_mutation_count(&character) == 3);
            assert!(character::get_corruption(&character) == 60);
            assert!(character::get_purity(&character) == 40);

            scenario.return_to_sender(character);
        };

        scenario.end();
    }
}
