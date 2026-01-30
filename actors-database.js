const actorsDatabase = [
    {
        id: 1,
        name: "Robert Downey Jr.",
        birthday: "April 4, 1965",
        birthYear: 1965,
        roles: [
            { film: "Iron Man", character: "Tony Stark", year: 2008 },
            { film: "The Avengers", character: "Tony Stark", year: 2012 },
            { film: "Avengers: Endgame", character: "Tony Stark", year: 2019 },
            { film: "Sherlock Holmes", character: "Sherlock Holmes", year: 2009 },
            { film: "Oppenheimer", character: "Lewis Strauss", year: 2023 },
            { film: "Tropic Thunder", character: "Kirk Lazarus", year: 2008 }
        ]
    },
    {
        id: 2,
        name: "Scarlett Johansson",
        birthday: "November 22, 1984",
        birthYear: 1984,
        roles: [
            { film: "Iron Man 2", character: "Natasha Romanoff", year: 2010 },
            { film: "The Avengers", character: "Black Widow", year: 2012 },
            { film: "Black Widow", character: "Natasha Romanoff", year: 2021 },
            { film: "Lost in Translation", character: "Charlotte", year: 2003 },
            { film: "Marriage Story", character: "Nicole Barber", year: 2019 },
            { film: "Lucy", character: "Lucy", year: 2014 }
        ]
    },
    {
        id: 3,
        name: "Chris Evans",
        birthday: "June 13, 1981",
        birthYear: 1981,
        roles: [
            { film: "Captain America: The First Avenger", character: "Steve Rogers", year: 2011 },
            { film: "The Avengers", character: "Captain America", year: 2012 },
            { film: "Avengers: Endgame", character: "Steve Rogers", year: 2019 },
            { film: "Knives Out", character: "Ransom Drysdale", year: 2019 },
            { film: "Fantastic Four", character: "Johnny Storm", year: 2005 }
        ]
    },
    {
        id: 4,
        name: "Chris Hemsworth",
        birthday: "August 11, 1983",
        birthYear: 1983,
        roles: [
            { film: "Thor", character: "Thor Odinson", year: 2011 },
            { film: "The Avengers", character: "Thor", year: 2012 },
            { film: "Thor: Ragnarok", character: "Thor", year: 2017 },
            { film: "Extraction", character: "Tyler Rake", year: 2020 },
            { film: "Rush", character: "James Hunt", year: 2013 }
        ]
    },
    {
        id: 5,
        name: "Tom Holland",
        birthday: "June 1, 1996",
        birthYear: 1996,
        roles: [
            { film: "Spider-Man: Homecoming", character: "Peter Parker", year: 2017 },
            { film: "Spider-Man: No Way Home", character: "Spider-Man", year: 2021 },
            { film: "Avengers: Endgame", character: "Peter Parker", year: 2019 },
            { film: "Uncharted", character: "Nathan Drake", year: 2022 },
            { film: "The Impossible", character: "Lucas", year: 2012 }
        ]
    },
    {
        id: 6,
        name: "Leonardo DiCaprio",
        birthday: "November 11, 1974",
        birthYear: 1974,
        roles: [
            { film: "Titanic", character: "Jack Dawson", year: 1997 },
            { film: "Inception", character: "Dom Cobb", year: 2010 },
            { film: "The Wolf of Wall Street", character: "Jordan Belfort", year: 2013 },
            { film: "The Revenant", character: "Hugh Glass", year: 2015 },
            { film: "Once Upon a Time in Hollywood", character: "Rick Dalton", year: 2019 },
            { film: "Killers of the Flower Moon", character: "Ernest Burkhart", year: 2023 }
        ]
    },
    {
        id: 7,
        name: "Margot Robbie",
        birthday: "July 2, 1990",
        birthYear: 1990,
        roles: [
            { film: "The Wolf of Wall Street", character: "Naomi Lapaglia", year: 2013 },
            { film: "Suicide Squad", character: "Harley Quinn", year: 2016 },
            { film: "Birds of Prey", character: "Harley Quinn", year: 2020 },
            { film: "Barbie", character: "Barbie", year: 2023 },
            { film: "Once Upon a Time in Hollywood", character: "Sharon Tate", year: 2019 },
            { film: "I, Tonya", character: "Tonya Harding", year: 2017 }
        ]
    },
    {
        id: 8,
        name: "Ryan Gosling",
        birthday: "November 12, 1980",
        birthYear: 1980,
        roles: [
            { film: "La La Land", character: "Sebastian Wilder", year: 2016 },
            { film: "Drive", character: "Driver", year: 2011 },
            { film: "Blade Runner 2049", character: "Officer K", year: 2017 },
            { film: "Barbie", character: "Ken", year: 2023 },
            { film: "The Notebook", character: "Noah Calhoun", year: 2004 },
            { film: "The Gray Man", character: "Six", year: 2022 }
        ]
    },
    {
        id: 9,
        name: "Cillian Murphy",
        birthday: "May 25, 1976",
        birthYear: 1976,
        roles: [
            { film: "Oppenheimer", character: "J. Robert Oppenheimer", year: 2023 },
            { film: "Inception", character: "Robert Fischer", year: 2010 },
            { film: "The Dark Knight", character: "Scarecrow", year: 2008 },
            { film: "28 Days Later", character: "Jim", year: 2002 },
            { film: "A Quiet Place Part II", character: "Emmett", year: 2021 }
        ]
    },
    {
        id: 10,
        name: "Florence Pugh",
        birthday: "January 3, 1996",
        birthYear: 1996,
        roles: [
            { film: "Black Widow", character: "Yelena Belova", year: 2021 },
            { film: "Midsommar", character: "Dani Ardor", year: 2019 },
            { film: "Little Women", character: "Amy March", year: 2019 },
            { film: "Oppenheimer", character: "Jean Tatlock", year: 2023 },
            { film: "Dune: Part Two", character: "Princess Irulan", year: 2024 }
        ]
    },
    {
        id: 11,
        name: "Timothee Chalamet",
        birthday: "December 27, 1995",
        birthYear: 1995,
        roles: [
            { film: "Dune", character: "Paul Atreides", year: 2021 },
            { film: "Dune: Part Two", character: "Paul Atreides", year: 2024 },
            { film: "Call Me by Your Name", character: "Elio Perlman", year: 2017 },
            { film: "Wonka", character: "Willy Wonka", year: 2023 },
            { film: "Little Women", character: "Laurie", year: 2019 }
        ]
    },
    {
        id: 12,
        name: "Zendaya",
        birthday: "September 1, 1996",
        birthYear: 1996,
        roles: [
            { film: "Spider-Man: Homecoming", character: "MJ", year: 2017 },
            { film: "Spider-Man: No Way Home", character: "MJ", year: 2021 },
            { film: "Dune", character: "Chani", year: 2021 },
            { film: "Dune: Part Two", character: "Chani", year: 2024 },
            { film: "The Greatest Showman", character: "Anne Wheeler", year: 2017 }
        ]
    },
    {
        id: 13,
        name: "Tom Hanks",
        birthday: "July 9, 1956",
        birthYear: 1956,
        roles: [
            { film: "Forrest Gump", character: "Forrest Gump", year: 1994 },
            { film: "Cast Away", character: "Chuck Noland", year: 2000 },
            { film: "Saving Private Ryan", character: "Captain John Miller", year: 1998 },
            { film: "Toy Story", character: "Woody (voice)", year: 1995 },
            { film: "The Green Mile", character: "Paul Edgecomb", year: 1999 },
            { film: "Elvis", character: "Colonel Tom Parker", year: 2022 }
        ]
    },
    {
        id: 14,
        name: "Meryl Streep",
        birthday: "June 22, 1949",
        birthYear: 1949,
        roles: [
            { film: "The Devil Wears Prada", character: "Miranda Priestly", year: 2006 },
            { film: "Mamma Mia!", character: "Donna Sheridan", year: 2008 },
            { film: "Sophie's Choice", character: "Sophie Zawistowski", year: 1982 },
            { film: "The Iron Lady", character: "Margaret Thatcher", year: 2011 },
            { film: "Little Women", character: "Aunt March", year: 2019 }
        ]
    },
    {
        id: 15,
        name: "Keanu Reeves",
        birthday: "September 2, 1964",
        birthYear: 1964,
        roles: [
            { film: "The Matrix", character: "Neo", year: 1999 },
            { film: "John Wick", character: "John Wick", year: 2014 },
            { film: "John Wick: Chapter 4", character: "John Wick", year: 2023 },
            { film: "Speed", character: "Jack Traven", year: 1994 },
            { film: "Bill & Ted's Excellent Adventure", character: "Ted Logan", year: 1989 },
            { film: "Point Break", character: "Johnny Utah", year: 1991 }
        ]
    },
    {
        id: 16,
        name: "Emma Stone",
        birthday: "November 6, 1988",
        birthYear: 1988,
        roles: [
            { film: "La La Land", character: "Mia Dolan", year: 2016 },
            { film: "Poor Things", character: "Bella Baxter", year: 2023 },
            { film: "Easy A", character: "Olive Penderghast", year: 2010 },
            { film: "The Amazing Spider-Man", character: "Gwen Stacy", year: 2012 },
            { film: "Birdman", character: "Sam Thomson", year: 2014 }
        ]
    },
    {
        id: 17,
        name: "Christian Bale",
        birthday: "January 30, 1974",
        birthYear: 1974,
        roles: [
            { film: "The Dark Knight", character: "Bruce Wayne", year: 2008 },
            { film: "American Psycho", character: "Patrick Bateman", year: 2000 },
            { film: "The Prestige", character: "Alfred Borden", year: 2006 },
            { film: "Vice", character: "Dick Cheney", year: 2018 },
            { film: "The Fighter", character: "Dicky Eklund", year: 2010 }
        ]
    },
    {
        id: 18,
        name: "Natalie Portman",
        birthday: "June 9, 1981",
        birthYear: 1981,
        roles: [
            { film: "Black Swan", character: "Nina Sayers", year: 2010 },
            { film: "V for Vendetta", character: "Evey Hammond", year: 2005 },
            { film: "Thor", character: "Jane Foster", year: 2011 },
            { film: "Thor: Love and Thunder", character: "Jane Foster", year: 2022 },
            { film: "Leon: The Professional", character: "Mathilda", year: 1994 }
        ]
    },
    {
        id: 19,
        name: "Brad Pitt",
        birthday: "December 18, 1963",
        birthYear: 1963,
        roles: [
            { film: "Fight Club", character: "Tyler Durden", year: 1999 },
            { film: "Once Upon a Time in Hollywood", character: "Cliff Booth", year: 2019 },
            { film: "Troy", character: "Achilles", year: 2004 },
            { film: "Bullet Train", character: "Ladybug", year: 2022 },
            { film: "Ocean's Eleven", character: "Rusty Ryan", year: 2001 },
            { film: "Se7en", character: "Detective David Mills", year: 1995 }
        ]
    },
    {
        id: 20,
        name: "Jennifer Lawrence",
        birthday: "August 15, 1990",
        birthYear: 1990,
        roles: [
            { film: "The Hunger Games", character: "Katniss Everdeen", year: 2012 },
            { film: "Silver Linings Playbook", character: "Tiffany Maxwell", year: 2012 },
            { film: "X-Men: First Class", character: "Mystique", year: 2011 },
            { film: "American Hustle", character: "Rosalyn Rosenfeld", year: 2013 },
            { film: "Don't Look Up", character: "Kate Dibiasky", year: 2021 }
        ]
    },
    {
        id: 21,
        name: "Samuel L. Jackson",
        birthday: "December 21, 1948",
        birthYear: 1948,
        roles: [
            { film: "Pulp Fiction", character: "Jules Winnfield", year: 1994 },
            { film: "The Avengers", character: "Nick Fury", year: 2012 },
            { film: "Django Unchained", character: "Stephen", year: 2012 },
            { film: "Unbreakable", character: "Elijah Price", year: 2000 },
            { film: "Snakes on a Plane", character: "Neville Flynn", year: 2006 }
        ]
    },
    {
        id: 22,
        name: "Matt Damon",
        birthday: "October 8, 1970",
        birthYear: 1970,
        roles: [
            { film: "Good Will Hunting", character: "Will Hunting", year: 1997 },
            { film: "The Martian", character: "Mark Watney", year: 2015 },
            { film: "The Bourne Identity", character: "Jason Bourne", year: 2002 },
            { film: "Oppenheimer", character: "Leslie Groves", year: 2023 },
            { film: "Saving Private Ryan", character: "Private James Ryan", year: 1998 }
        ]
    },
    {
        id: 23,
        name: "Anne Hathaway",
        birthday: "November 12, 1982",
        birthYear: 1982,
        roles: [
            { film: "The Dark Knight Rises", character: "Selina Kyle", year: 2012 },
            { film: "Les Miserables", character: "Fantine", year: 2012 },
            { film: "The Devil Wears Prada", character: "Andy Sachs", year: 2006 },
            { film: "Interstellar", character: "Dr. Amelia Brand", year: 2014 },
            { film: "The Princess Diaries", character: "Mia Thermopolis", year: 2001 }
        ]
    },
    {
        id: 24,
        name: "Morgan Freeman",
        birthday: "June 1, 1937",
        birthYear: 1937,
        roles: [
            { film: "The Shawshank Redemption", character: "Ellis Boyd Redding", year: 1994 },
            { film: "Se7en", character: "Detective William Somerset", year: 1995 },
            { film: "The Dark Knight", character: "Lucius Fox", year: 2008 },
            { film: "Bruce Almighty", character: "God", year: 2003 },
            { film: "Million Dollar Baby", character: "Eddie Dupris", year: 2004 }
        ]
    },
    {
        id: 25,
        name: "Joaquin Phoenix",
        birthday: "October 28, 1974",
        birthYear: 1974,
        roles: [
            { film: "Joker", character: "Arthur Fleck", year: 2019 },
            { film: "Gladiator", character: "Commodus", year: 2000 },
            { film: "Her", character: "Theodore Twombly", year: 2013 },
            { film: "Walk the Line", character: "Johnny Cash", year: 2005 },
            { film: "Napoleon", character: "Napoleon Bonaparte", year: 2023 }
        ]
    },
    {
        id: 26,
        name: "Viola Davis",
        birthday: "August 11, 1965",
        birthYear: 1965,
        roles: [
            { film: "Fences", character: "Rose Maxson", year: 2016 },
            { film: "The Help", character: "Aibileen Clark", year: 2011 },
            { film: "The Woman King", character: "Nanisca", year: 2022 },
            { film: "Suicide Squad", character: "Amanda Waller", year: 2016 },
            { film: "Ma Rainey's Black Bottom", character: "Ma Rainey", year: 2020 }
        ]
    },
    {
        id: 27,
        name: "Denzel Washington",
        birthday: "December 28, 1954",
        birthYear: 1954,
        roles: [
            { film: "Training Day", character: "Alonzo Harris", year: 2001 },
            { film: "Malcolm X", character: "Malcolm X", year: 1992 },
            { film: "Gladiator II", character: "Macrinus", year: 2024 },
            { film: "The Equalizer", character: "Robert McCall", year: 2014 },
            { film: "Fences", character: "Troy Maxson", year: 2016 }
        ]
    },
    {
        id: 28,
        name: "Austin Butler",
        birthday: "August 17, 1991",
        birthYear: 1991,
        roles: [
            { film: "Elvis", character: "Elvis Presley", year: 2022 },
            { film: "Dune: Part Two", character: "Feyd-Rautha Harkonnen", year: 2024 },
            { film: "Once Upon a Time in Hollywood", character: "Tex Watson", year: 2019 },
            { film: "The Bikeriders", character: "Benny", year: 2024 }
        ]
    },
    {
        id: 29,
        name: "Pedro Pascal",
        birthday: "April 2, 1975",
        birthYear: 1975,
        roles: [
            { film: "Wonder Woman 1984", character: "Maxwell Lord", year: 2020 },
            { film: "The Unbearable Weight of Massive Talent", character: "Javi Gutierrez", year: 2022 },
            { film: "Triple Frontier", character: "Francisco Morales", year: 2019 },
            { film: "Gladiator II", character: "Marcus Acacius", year: 2024 }
        ]
    },
    {
        id: 30,
        name: "Saoirse Ronan",
        birthday: "April 12, 1994",
        birthYear: 1994,
        roles: [
            { film: "Little Women", character: "Jo March", year: 2019 },
            { film: "Lady Bird", character: "Christine McPherson", year: 2017 },
            { film: "Brooklyn", character: "Eilis Lacey", year: 2015 },
            { film: "Atonement", character: "Briony Tallis", year: 2007 },
            { film: "The Outrun", character: "Rona", year: 2024 }
        ]
    }
];
