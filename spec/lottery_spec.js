var vows    = require('vows'),
    assert  = require('assert'),
    lotterySimulator = require('./helpers/lottery_simulator'),
    lottery = require('../lottery');

vows.describe('canWeWin').addBatch({

    '100 entrants (just me, single winner, infinite tickets)':
        createGetTickersContext({
                entrants: 100
        }),

    '100 entrants, 2 friends (single winner, infinite tickets)': 
        createGetTickersContext({
            entrants: 100,
            friends: 2
        }),

    '100 entrants, 2 friends, 10 winners (infinite tickets)': 
        createGetTickersContext({
            entrants: 100,
            friends: 2,
            winners: 10
        }),

    '10 entrants, 1 friends, 10 winners (infinite tickets)': 
    createGetTickersContext({
        entrants: 10,
        winners: 10,
        friends: 1
    }),

    '100 entrants, 2 friends, 10 winners, 1 tickets each': 
        createGetTickersContext({
            entrants: 100,
            friends: 2,
            winners: 10,
            tickets: 1
        }),

    '10 entrants, 6 friends, 6 winners, 1 tickets each': 
        createGetTickersContext({
            entrants: 10,
            winners: 6,
            tickets: 1,
            friends: 6
        }),

    '80 entrants, 4 friends, 4 winners, 2 tickets each': 
        createGetTickersContext({
            entrants: 80,
            winners: 4,
            tickets: 2,
            friends: 4
        }),

    '80 entrants, 5 friends, 4 winners, 2 tickets each': 
        createGetTickersContext({
            entrants: 80,
            winners: 4,
            tickets: 2,
            friends: 5
        }),

    
    '100 entrants, 9 friends, 10 winners, 3 tickets each': 
        createGetTickersContext({
            entrants: 100,
            winners: 10,
            tickets: 3,
            friends: 9
        }),


    'calculateScenarioProbability 1': {
    	
    	topic: function() {
    		var p1 = lottery.calculateScenarioProbability([ 1, 0 ], 2, 100)
    		var p2 = lottery.calculateScenarioProbability([ 1, 1 ], 2, 100)
    		var p3 = lottery.calculateScenarioProbability([ 0, 1 ], 2, 100)
    		var p4 = lottery.calculateScenarioProbability([ 0, 0 ], 2, 100)
    		return p1+p2+p3+p4
    	},

    	'should be 1': function(prob) {
    		assert.equal(prob, 1)
    	}
    },

    'calculateScenarioProbability 2': {
    	
    	topic: function() {
    		var scenarios10Winners = lottery.generateCases(10)
    		var totalProb = 0
    		for (var i=0;i<scenarios10Winners.length;i++) {
    			var s = scenarios10Winners[i]
    			totalProb += lottery.calculateScenarioProbability(s, 2, 100)
    		}

    		return totalProb
    	},

    	'should be 1': function(prob) {
    		assert.equal(prob, 1)
    	}
    },

    'calculateScenarioProbability 3': {
    	
    	topic: function() {
    		var scenarios10Winners = lottery.generateCases(10)
			var scenariosWhereWeGetEnoughTickets = lottery.filterCases(scenarios10Winners, 1, 2)
    		var totalProb = 0
    		for (var i=0;i<scenariosWhereWeGetEnoughTickets.length;i++) {
    			var s = scenariosWhereWeGetEnoughTickets[i]
    			totalProb += lottery.calculateScenarioProbability(s, 2, 100)
    		}

    		return totalProb
    	},

    	'should be correct': function(prob) {
    		assert.equal(prob, 0.19090909090909097)
    	}
    },

    'generateCases': {
        topic: function() {
            return lottery.generateCases(4)
        },

        'correct': function(err, cases) {
            if(err) throw err;
            
            assert.equal(cases.length, 16)
            assert.isTrue(arrayContainsArray(cases, [1,1,1,1]))
            assert.isTrue(arrayContainsArray(cases, [1,1,1,0]))
            assert.isTrue(arrayContainsArray(cases, [1,1,0,0]))
            assert.isTrue(arrayContainsArray(cases, [1,0,0,0]))
            assert.isTrue(arrayContainsArray(cases, [1,0,1,0]))
            assert.isTrue(arrayContainsArray(cases, [0,0,1,0]))
            assert.isTrue(arrayContainsArray(cases, [0,0,0,0]))
            assert.isTrue(arrayContainsArray(cases, [0,1,0,0]))

        } 

    },

    'filterCases': {
        topic: function() {
            return lottery.filterCases([
                [1,0,1,0,1,1],
                [0,0,1,0,1,1],
                [0,0,0,0,1,1],
                [0,0,0,1,1,1],
                [1,0,0,0,0,1],
                [1,1,0,1,0,1]
            ], 3)
        },

        'should return all cases with 3 or more wins': function(filtered) {
            assert.equal(filtered.length, 4)
            assert.isTrue(arrayContainsArray(filtered, [1,0,1,0,1,1]))
            assert.isTrue(arrayContainsArray(filtered, [0,0,1,0,1,1]))
            assert.isTrue(arrayContainsArray(filtered, [1,0,1,0,1,1]))
            assert.isTrue(arrayContainsArray(filtered, [1,1,0,1,0,1]))
        }

    }


}).export(module); 

function createGetTickersContext(opts) {
    return {
        topic: function() {
        	var cb = this.callback
            lottery.canWeGetTickets(opts, function(err, probability) {
            	lotterySimulator.isPlausible(probability, opts, cb)
            });
        },

        'returns plausible probability': function (isPlausibleResult) {
            assert.isTrue(isPlausibleResult)
        }
    }
}



function arrayContainsArray(arrContainer, arrFind) {
    for(var i=0;i<arrContainer.length;i++)
        if (arrayMatchesArray(arrContainer[i], arrFind))
            return true;
    return false;
}

function arrayMatchesArray(left, right) {
    for(var i=0;i<left.length;i++)
        if(left[i] != right[i])
            return false;
    return true;
}

