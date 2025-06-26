import { Abi } from "starknet";

export const PROOFOFHABIT_ABI: Abi = [
  {
    type: "impl",
    name: "ProofOfHabitImpl",
    interface_name: "proof_of_habit::interfaces::IProofOfHabit::IProofOfHabit",
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "struct",
    name: "proof_of_habit::base::types::Habit",
    members: [
      {
        name: "id",
        type: "core::integer::u32",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "info",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "created_at",
        type: "core::integer::u64",
      },
      {
        name: "last_log_at",
        type: "core::integer::u64",
      },
      {
        name: "streak_count",
        type: "core::integer::u32",
      },
      {
        name: "total_log_count",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "struct",
    name: "proof_of_habit::base::types::Entry",
    members: [
      {
        name: "id",
        type: "core::integer::u32",
      },
      {
        name: "log_info",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "timestamp",
        type: "core::integer::u64",
      },
    ],
  },
  {
    type: "interface",
    name: "proof_of_habit::interfaces::IProofOfHabit::IProofOfHabit",
    items: [
      {
        type: "function",
        name: "set_user_name",
        inputs: [
          {
            name: "name",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "create_habit",
        inputs: [
          {
            name: "infoUid",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [
          {
            type: "core::integer::u32",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "log_entry",
        inputs: [
          {
            name: "habit_id",
            type: "core::integer::u32",
          },
          {
            name: "log_info",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_user_habits",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<proof_of_habit::base::types::Habit>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_user_habits_ids",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<core::integer::u32>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_habit_logs",
        inputs: [
          {
            name: "habit_id",
            type: "core::integer::u32",
          },
          {
            name: "start",
            type: "core::integer::u32",
          },
          {
            name: "count",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<proof_of_habit::base::types::Entry>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_streak",
        inputs: [
          {
            name: "habit_id",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::integer::u32",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_user_longest_streak",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u32",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_user_name",
        inputs: [
          {
            name: "wallet",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_wallet_from_user_name",
        inputs: [
          {
            name: "user_name",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_total_habit_count",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u32",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_habit_log_count",
        inputs: [
          {
            name: "habit_id",
            type: "core::integer::u32",
          },
        ],
        outputs: [
          {
            type: "core::integer::u32",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_total_logs_user",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u32",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_total_user_habits",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u32",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "event",
    name: "proof_of_habit::ProofOfHabit::ProofOfHabit::UsernameSet",
    kind: "struct",
    members: [
      {
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "username",
        type: "core::felt252",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "proof_of_habit::ProofOfHabit::ProofOfHabit::HabitCreated",
    kind: "struct",
    members: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "habit_id",
        type: "core::integer::u32",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "proof_of_habit::ProofOfHabit::ProofOfHabit::EntryLogged",
    kind: "struct",
    members: [
      {
        name: "habit_id",
        type: "core::integer::u32",
        kind: "data",
      },
      {
        name: "timestamp",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "log_info",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "proof_of_habit::ProofOfHabit::ProofOfHabit::Event",
    kind: "enum",
    variants: [
      {
        name: "UsernameSet",
        type: "proof_of_habit::ProofOfHabit::ProofOfHabit::UsernameSet",
        kind: "nested",
      },
      {
        name: "HabitCreated",
        type: "proof_of_habit::ProofOfHabit::ProofOfHabit::HabitCreated",
        kind: "nested",
      },
      {
        name: "EntryLogged",
        type: "proof_of_habit::ProofOfHabit::ProofOfHabit::EntryLogged",
        kind: "nested",
      },
    ],
  },
];
