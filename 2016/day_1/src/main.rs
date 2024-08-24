use std::{
    collections::{HashMap, HashSet},
    fs::File,
    io::prelude::*,
    path::Path,
};

const INPUT_PATH: &str = "./src/inputs/input.txt";

fn main() {
    println!("Advent of code 2016, day 1");
    let input: String = read_input();
    let instructions: Vec<(char, i32)> = parse_input(input);
    println!("{:?}", instructions);
    part1(&instructions);
    part2(&instructions);
}

fn read_input() -> String {
    let path = Path::new(INPUT_PATH);
    let display = path.display();
    println!("Using input file located at {display}");
    let mut file = match File::open(&path) {
        Err(why) => panic!("couldn't open {}: {}", display, why),
        Ok(file) => file,
    };
    let mut s = String::new();
    match file.read_to_string(&mut s) {
        Err(why) => panic!("couldn't read {}: {}", display, why),
        Ok(_) => println!("File content successfully read"),
    }
    return s;
}

fn parse_input(s: String) -> Vec<(char, i32)> {
    let s = s.replace("\n", "");
    println!("{s}");
    let mut instructions: Vec<(char, i32)> = Vec::new();
    for instruction in s.split(", ") {
        let turn = match instruction.chars().next() {
            Some(c) => c,
            None => panic!("Invalid instruction {instruction}"),
        };
        let steps = match instruction[1..].to_string().parse::<i32>() {
            Ok(n) => n,
            Err(e) => panic!("Invalid instruction {instruction}, error {e}"),
        };
        instructions.push((turn, steps));
    }
    return instructions;
}

fn get_next_direction(dir: &char, turn: &char) -> char {
    let directions = ['N', 'E', 'S', 'W'];
    for i in 0..directions.len() {
        if directions[i] == *dir {
            match turn {
                &'R' => return directions[(i + 1) % directions.len()],
                &'L' => return directions[if i > 0 { i - 1 } else { directions.len() - 1 }],
                _ => panic!("Invalid turn {turn}"),
            };
        }
    }
    panic!("Invalid dir, turn {dir} {turn}");
}

fn walk_the_path(instructions: &Vec<(char, i32)>, stop_when_visited: bool) -> i32 {
    let mut offsets = HashMap::new();
    offsets.insert('N', (0, 1));
    offsets.insert('E', (1, 0));
    offsets.insert('S', (0, -1));
    offsets.insert('W', (-1, 0));
    let starting_position: (i32, i32) = (0, 0);
    let (mut current_direction, mut current_position) = ('N', starting_position);
    let mut visited_places = HashSet::new();
    visited_places.insert(starting_position);
    'path_loop: for (turn, steps) in instructions {
        println!("Turn {turn}; steps {steps}");
        current_direction = get_next_direction(&current_direction, &turn);
        println!("{current_direction}");
        if stop_when_visited {
            for _ in 0..*steps {
                current_position.0 += offsets[&current_direction].0;
                current_position.1 += offsets[&current_direction].1;
                if visited_places.contains(&current_position) {
                    break 'path_loop;
                }
                visited_places.insert(current_position);
            }
        } else {
            current_position.0 += steps * offsets[&current_direction].0;
            current_position.1 += steps * offsets[&current_direction].1;
        }
    }
    println!("Final position is {:?}", current_position);
    let distance = (current_position.0 - starting_position.0).abs()
        + (current_position.1 - starting_position.1).abs();
    println!(
        "Shortest path from {:?} to {:?} is {} steps long",
        starting_position, current_position, distance
    );
    return distance;
}

fn part1(instructions: &Vec<(char, i32)>) {
    let shortest_path_length = walk_the_path(instructions, false);
    println!("Answer for part 1: {shortest_path_length}");
}

fn part2(instructions: &Vec<(char, i32)>) {
    let shortest_path_length = walk_the_path(instructions, true);
    println!("Answer for part 2: {shortest_path_length}");
}
