import * as audioFR from './getAudioFR';
import * as audioEN from './getAudioEN';
// var fs = require("fs")
// var vm = require('vm')
// eval(fs.readFileSync(__dirname + '/getAudioFR.js')+'');
// eval(fs.readFileSync(__dirname + '/getAudioEN.js')+'');

/*function to search the index of random folder to define the entry's vocal
    @parmams :
        langage : default langage
*/
export function randomEntryFolder(language) {
	let audio;
	if (language == 'FR') {
		audio = audioFR;
		// Search random index within the folder
		const randomIndex = Math.floor(Math.random() * audio.entryWelcome.length);
		return audio.entryWelcome[randomIndex];
	} else if (language == 'EN') {
		audio = audioEN;
		// Search random index within the folder
		const randomIndex = Math.floor(Math.random() * audio.entryWelcome.length);
		return audio.entryWelcome[randomIndex];
	} else {
		console.log('PROBLEME WITH LANGUAGE SOURCE IN randomEntryFolder, language : ' + language);
	}
}

/*function to search the index of random folder to define the number of sips
    @parmams :
        mod : mod choose by the user
        nbActionsUser : the number of the user's actions
        langage : default langage
*/
export function randomSipFolder(mod, nbActionsUser, langage, groupAction) {
	let audio;
	//proba for user's actions
	let actionUser;
	if (langage == 'FR') {
		audio = audioFR;
	} else if (langage == 'EN') {
		audio = audioEN;
	}

	// 10% of groupAction
	if (groupAction) {
		//if he has actions
		if (nbActionsUser) {
			//to put user's action on 10% proba
			const randomProba = Math.random() * 100;
			if (randomProba < 10) {
				actionUser = 1;
			} else {
				actionUser = 0;
			}
		} else {
			actionUser = 0;
		}

		if (actionUser) {
			return 'UserAction';
		} else {
			const randomIndex = Math.floor(Math.random() * audio.ebyAction.length);
			// console.log('Every body action ' + randomIndex);
			return audio.ebyAction[randomIndex];
		}
	} else {
		// individual action
		//proba for folder according to mods
		const sipFolderRandom = Math.random() * 100;

		//if he has actions
		if (nbActionsUser) {
			//to put user's action on 10% proba
			const randomProba = Math.random() * 100;
			if (randomProba < 10) {
				actionUser = 1;
			} else {
				actionUser = 0;
			}
		} else {
			actionUser = 0;
		}

		if (actionUser) {
			return 'UserAction';
		} else {
			//no action's user
			//mod normal
			if (mod == 0) {
				// 50% distri or take
				const distriTake = Math.round(Math.random());
				if (sipFolderRandom < 30) {
					//distri
					if (distriTake) {
						const randomIndex = Math.floor(Math.random() * audio.fewActionDis.length);
						// console.log('few Distri' + randomIndex);
						return audio.fewActionDis[randomIndex];
					} else {
						//take
						const randomIndex = Math.floor(Math.random() * audio.fewActionTak.length);
						// console.log('few Take' + randomIndex);
						return audio.fewActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 30 && sipFolderRandom < 60) {
					if (distriTake) {
						const randomIndex = Math.floor(Math.random() * audio.mediumActionDis.length);
						// console.log('medium Distri' + randomIndex);
						return audio.mediumActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.mediumActionTak.length);
						// console.log('medium Take' + randomIndex);
						return audio.mediumActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 60 && sipFolderRandom < 90) {
					if (distriTake) {
						const randomIndex = Math.floor(Math.random() * audio.manyActionDis.length);
						// console.log('many Distri' + randomIndex);
						return audio.manyActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.manyActionTak.length);
						// console.log('many Take' + randomIndex);
						return audio.manyActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 90 && sipFolderRandom < 100) {
					if (distriTake) {
						const randomIndex = Math.floor(Math.random() * audio.calActionDis.length);
						// console.log('chug_a_lug Distri' + randomIndex);
						return audio.calActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.calActionTak.length);
						// console.log('chug_a_lug Take' + randomIndex);
						return audio.calActionTak[randomIndex];
					}
				}
			} else if (mod == 1) {
				//mod shot
				// 20% distri 80% take
				const distriTake = Math.random() * 100;
				if (sipFolderRandom < 10) {
					//distri
					if (distriTake < 20) {
						const randomIndex = Math.floor(Math.random() * audio.fewActionDis.length);
						// console.log('few Distri' + randomIndex);
						return audio.fewActionDis[randomIndex];
					} else {
						//take
						const randomIndex = Math.floor(Math.random() * audio.fewActionTak.length);
						// console.log('few Take' + randomIndex);
						return audio.fewActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 10 && sipFolderRandom < 30) {
					if (distriTake < 20) {
						const randomIndex = Math.floor(Math.random() * audio.mediumActionDis.length);
						// console.log('medium Distri' + randomIndex);
						return audio.mediumActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.mediumActionTak.length);
						// console.log('medium Take' + randomIndex);
						return audio.mediumActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 30 && sipFolderRandom < 50) {
					if (distriTake < 20) {
						const randomIndex = Math.floor(Math.random() * audio.manyActionDis.length);
						// console.log('many Distri' + randomIndex);
						return audio.manyActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.manyActionTak.length);
						// console.log('many Take' + randomIndex);
						return audio.manyActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 50 && sipFolderRandom < 100) {
					if (distriTake < 20) {
						const randomIndex = Math.floor(Math.random() * audio.shotActionDis.length);
						// console.log('shot Distri' + randomIndex);
						return audio.shotActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.shotActionTak.length);
						// console.log('shot Take' + randomIndex);
						return audio.shotActionTak[randomIndex];
					}
				}
			} else if (mod == 2) {
				//mod distribution
				// 80% distri 20% take
				const distriTake = Math.random() * 100;
				if (sipFolderRandom < 10) {
					//distri
					if (distriTake < 80) {
						const randomIndex = Math.floor(Math.random() * audio.fewActionDis.length);
						// console.log('few Distri' + randomIndex);
						return audio.fewActionDis[randomIndex];
					} else {
						//take
						const randomIndex = Math.floor(Math.random() * audio.fewActionTak.length);
						// console.log('few Take' + randomIndex);
						return audio.fewActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 10 && sipFolderRandom < 40) {
					if (distriTake < 80) {
						const randomIndex = Math.floor(Math.random() * audio.mediumActionDis.length);
						// console.log('medium Distri' + randomIndex);
						return audio.mediumActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.mediumActionTak.length);
						// console.log('medium Take' + randomIndex);
						return audio.mediumActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 40 && sipFolderRandom < 80) {
					if (distriTake < 80) {
						const randomIndex = Math.floor(Math.random() * audio.manyActionDis.length);
						// console.log('many Distri' + randomIndex);
						return audio.manyActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.manyActionTak.length);
						// console.log('many Take' + randomIndex);
						return audio.manyActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 80 && sipFolderRandom < 100) {
					if (distriTake < 80) {
						const randomIndex = Math.floor(Math.random() * audio.calActionDis.length);
						// console.log('chug_a_lug Distri' + randomIndex);
						return audio.calActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.calActionTak.length);
						// console.log('chug_a_lug Take' + randomIndex);
						return audio.calActionTak[randomIndex];
					}
				}
			} else if (mod == 3) {
				//mod hardcore
				// 50% distri or take
				const distriTake = Math.round(Math.random());
				if (sipFolderRandom < 5) {
					//distri
					if (distriTake) {
						const randomIndex = Math.floor(Math.random() * audio.fewActionDis.length);
						// console.log('few Distri' + randomIndex);
						return audio.fewActionDis[randomIndex];
					} else {
						//take
						const randomIndex = Math.floor(Math.random() * audio.fewActionTak.length);
						// console.log('few Take' + randomIndex);
						return audio.fewActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 5 && sipFolderRandom < 20) {
					if (distriTake) {
						const randomIndex = Math.floor(Math.random() * audio.mediumActionDis.length);
						// console.log('medium Distri' + randomIndex);
						return audio.mediumActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.mediumActionTak.length);
						// console.log('medium Take' + randomIndex);
						return audio.mediumActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 20 && sipFolderRandom < 75) {
					if (distriTake) {
						const randomIndex = Math.floor(Math.random() * audio.manyActionDis.length);
						// console.log('many Distri' + randomIndex);
						return audio.manyActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.manyActionTak.length);
						// console.log('many Take' + randomIndex);
						return audio.manyActionTak[randomIndex];
					}
				} else if (sipFolderRandom >= 75 && sipFolderRandom < 100) {
					if (distriTake) {
						const randomIndex = Math.floor(Math.random() * audio.calActionDis.length);
						// console.log('chug_a_lug Distri' + randomIndex);
						return audio.calActionDis[randomIndex];
					} else {
						const randomIndex = Math.floor(Math.random() * audio.calActionTak.length);
						// console.log('chug_a_lug Take' + randomIndex);
						return audio.calActionTak[randomIndex];
					}
				}
			} else {
				//pas le bon mod
				// console.log('Error, no mod');
			}
			// console.log('Index du tableau : ' + randomIndex);
		}
	}
}

// randomSipFolder(0,0,"FR");
