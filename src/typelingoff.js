console.log("typelingoff loaded")

function request_listener(details) {
	console.log(details);
	let filter = browser.webRequest.filterResponseData(details.requestId);
	let datalen = 0;
	let data = [];
	filter.ondata = (event) => {
		console.log(event);
		let as_array = new Uint8Array(event.data);
		//console.log(as_array);
		for(const b of as_array){
			data[datalen] = b;
			datalen = datalen + 1;
		}
		//console.log(data);
		//console.log(datalen);
	};
	filter.onstop = (event) => {
		console.log(event);
		//console.log(data);
		let orig_array = new Uint8Array(data);
		let decoder = new TextDecoder("utf-8");
		let text = decoder.decode(orig_array);
		let json = JSON.parse(text);
		let challenges = json["challenges"];
		let replacement_challenges = json["adaptiveInterleavedChallenges"]["challenges"]

		if (challenges == undefined){
			console.log("challenges not found");
			filter.write(orig_array);
			filter.disconnect();
			return;
		}

		let all_challenges = challenges;
		if (replacement_challenges == undefined){
			console.log("replacement challenges not found");
		}else{
			all_challenges = challenges.concat(replacement_challenges);
		}

		let challenge_generators = {};

		for (c of all_challenges){
			challenge_generators[c["challengeGeneratorIdentifier"]["specificType"]] = {
				id:c["challengeGeneratorIdentifier"]["generatorId"],
				type:c["type"]
			}
		}

		console.log(challenge_generators);

		for (c of all_challenges){
			c["challengeDisplaySettings"] = {
				canRequireUserToType:true,
				showInputModeToggle:true
			};

			let changed = false;

			if (c["challengeGeneratorIdentifier"]["specificType"] == "tap"
			){
				let sourceLanguage = c["sourceLanguage"];
				let targetLanguage = c["targetLanguage"];
				c["sourceLanguage"] = targetLanguage;
				c["targetLanguage"] = sourceLanguage;
				if (c["sourceLanguage"] == undefined || c["targetLanguage"] == undefined){
					c["sourceLanguage"] = json["fromLanguage"];
					c["targetLanguage"] = json["learningLanguage"];
				}
				console.log("reversed exercise (" + c["prompt"] + ")")
				changed = true;
			}

			if (!changed){
				console.log("left " + c["type"] + " exercise (" + c["prompt"] + ") untouched");
			}
		}

		let encoder = new TextEncoder("utf-8");
		let new_data = encoder.encode(JSON.stringify(json));
		
		console.log(json);
		filter.write(new_data);
		filter.disconnect();
	}
	console.log(filter);
}

console.log(browser);
console.log(browser.webRequest);

let request_listener_filter = {
	urls: ["*://*.duolingo.com/*/sessions"]
};

browser.webRequest.onBeforeRequest.addListener(request_listener, request_listener_filter, ["blocking"])
