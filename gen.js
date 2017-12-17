NB_MOV = 30;

Array.prototype.shuffle = function() {
    var i = this.length,
        j,
        temp;
    if (i === 0) {
        return this;
    }
    while (--i) {
       j = Math.floor(Math.random() * (i + 1));
       temp = this[i];
       this[i] = this[j];
       this[j] = temp;
    }
    return this;
  }

  function compare(a,b) {
    if (a[0] < b[0])
      return -1;
    if (a[0] > b[0])
      return 1;
    return 0;
  }

//Generate a list of 30 mouvements
var makeChromosome = function () {
    var chromosome = '';
    for (var i = 0; i < NB_MOV; i++) {
        chromosome += String(Math.floor(Math.random() * 4));
    }
    return [null, chromosome];
}

var makePopulation = function (nbGen) {
    var population = [];
    for (var i = 0; i < nbGen; i++) {
        population.push(makeChromosome());
    }
    return population;
}

var selection = function (population) {
    return population.slice(0, 79).shuffle();;
}

var evaluation = function (maze, chromosome) {
    var score = 0,
        penalties = 0,
        userPos = findPos(maze, 2),
        finishPos = findPos(maze, 3),
        result;
    //Determine score with movements into maze
    for (var i = 0; i < chromosome.length; i++) {
        //TODO
        result = moveUser(maze, chromosome[i], userPos);
        userPos = result[0];
        penalties += result[1];

        //User hit finish line
        if (result[2]) {
            chromosome = chromosome.substr(0, i + 1);
            break;
        }
    }

    //score = Manhattan distance + penalties
    score = (finishPos[0] - userPos[0]) + (finishPos[1] - userPos[1]) + penalties;
    return [score, chromosome];
}

var moveUser = function (maze, direction, pos) {
    var isOver = false,
        penalty = 0,
        newPos = pos;
    if (!didPlayerCanMove(maze, direction, pos)) {
        return [pos, 1, isOver];
    } else {
        switch (direction) {
            case '0':
                newPos[0] = newPos[0] - 1;
                didPlayerHitWall(maze[newPos[0]][newPos[1]]) ? penalty++ : 0;
                break;

            case '1':
                newPos[1] = newPos[1] + 1;
                didPlayerHitWall(maze[newPos[0]][newPos[1]]) ? penalty++ : 0;
                break;

            case '2':
                newPos[0] = newPos[0] + 1;
                didPlayerHitWall(maze[newPos[0]][newPos[1]]) ? penalty++ : 0;
                break;

            case '3':
                newPos[1] = newPos[1] - 1;
                didPlayerHitWall(maze[newPos[0]][newPos[1]]) ? penalty++ : 0;
                break;
        }
    }

    isOver = didPlayerHitFinish(maze[pos[0]][pos[1]]);
    
    return [newPos, penalty, isOver];
}

var findPos = function (maze, el) {
    var i = 0,
        index;
    for (; i < maze.length; i++) {
        index = maze[i].indexOf(el);
        if (index > -1) {
            return [i, index];
        }
    }
}

var didPlayerCanMove = function (maze, direction, pos) {
    var row = maze.length,
        column = maze[0].length;
    switch (direction) {
        case '0':
            return pos[0] - 1  > -1;

        case '1':
            return pos[1] + 1 < column;

        case '2':
            return pos[0] + 1 < row;

        case '3':
            return pos[1] - 1 > -1;
    }
}

var didPlayerHitWall = function (el) {
    return el === 1;
}

var didPlayerHitFinish = function (el) {
    return el === 3;
}

var scorePopulation = function (population, maze) {
    var newPop = [];
    population.map(function (x) {
        newPop.push(evaluation(maze, x[1]));
    }) 

    return newPop;
}


var crossover = function (parent1, parent2) {
    var point = Math.floor((Math.random() * (NB_MOV - 1) + 1));
    var child1 = [null, parent1[1].substr(0, point) + parent2[1].substr(point)];
    var child2 = [null, parent2[1].substr(0, point) + parent1[1].substr(point)];

    return [child1, child2];
}

var nextGeneration = function (selection) {
    var population = makePopulation(20),
        parentTab,
        childTab;
    for (var i = 0; i < 39; i++) {
        parentTab = selection.splice(0, 2);
        childTab = crossover(parentTab[0], parentTab[1]);
        population.push(childTab[0], childTab[1]);
    }

    return population;
}

var mutation = function (population) {
    population.map(function(x) {
        //Rate 1/1000
        if (Math.floor((Math.random() * 1000 + 1)) === 0) {
            x = mutate(individual)
        }
    });

    return population;
}

var mutate = function (chromosome) {
    var bit = Math.floor((Math.random() * NB_MOV + 1));
    var value = chromosome[1];

    //TODO EDIT MUTATE

    return [null, value];
}

var translateSolution = function (solution) {
    var translation = [];
    for (i = 0; i < solution[1].length; i++) {
        switch (solution[1][i]) {
            case '0':
                translation.push('↑');
                break;

            case '1':
                translation.push('→');
                break;

            case '2':
                translation.push('↓');
                break;

            case '3':
                translation.push('←');
                break;
        ;}
    }

    return translation.join('  ');
}

module.exports = {
    main: function (data) {
        var maze = data,
            resultat,
            best;

        if (typeof maze === 'undefined' || maze === null) {
            console.log('Build a maze ! ¯\\_(ツ)_/¯');
            return;
        }
        var population = makePopulation(100);
        for (var i = 0; i < 1000; i++) {
            resultat = scorePopulation(population, maze).sort(compare);
            best = resultat[0];
            if (best[0] === 0) {
                console.log(translateSolution(best));
                break;
            }
            population = mutation(nextGeneration(selection(population)));
        };
        
        if (best[0] !== 0) {
            //In case of extremum local, reload everything
            this.main(maze);
       }
    }
}