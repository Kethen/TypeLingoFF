console.log("typelingoff loaded")

function process_session(details){
	console.log("wdf");
	console.log(details);
}

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

		if (challenges == undefined){
			console.log("challenges not found");
			filter.write(orig_array);
			filter.disconnect();
			return;
		}

		let challenge_generators = {};

		for (c of challenges){
			challenge_generators[c["challengeGeneratorIdentifier"]["specificType"]] = c["challengeGeneratorIdentifier"]["generatorId"];
		}

		console.log(challenge_generators);

		for (c of challenges){
			c["challengeDisplaySettings"] = {
				canRequireUserToType:true,
				showInputModeToggle:true
			};
			if (c["challengeGeneratorIdentifier"]["specificType"] == "tap"){
				let sourceLanguage = c["sourceLanguage"];
				let targetLanguage = c["targetLanguage"];
				c["sourceLanguage"] = targetLanguage;
				c["targetLanguage"] = sourceLanguage;
				let reverse_tap_generator = challenge_generators["reverse_tap"];
				if (reverse_tap_generator != undefined){
					c["challengeGeneratorIdentifier"] = {
						specificType:"reverse_tap",
						generatorId:reverse_tap_generator,
					};
				}
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
