const NYTBaseUrl = "https://api.nytimes.com/svc/topstories/v2/";
const ApiKey = "89982d51028e40d592109d6ecf6c6ad4";

function buildUrl(url) {
	return NYTBaseUrl + url + ".json?api-key=" + ApiKey
}

Vue.component("news-list", {
	props: ["results"],
	template: `
		<section>
			<div class="row" v-for="posts in processedPosts">
				<div class="columns large-3 medium-6" v-for="post in posts">
					<div class="card">
						<div class="card-divider">
							{{ post.title }}
						</div>
						<a :href="post.url" target="_blank"><img :src="post.image_url"></a>
						<div class="card-section">
							<p>{{ post.abstract }}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	computed: {
		processedPosts() {
			let posts = this.results;

			posts.map(post => {
				let imgObj = post.multimedia.find(media => media.format === "superJumbo");
				post.image_url = imgObj ? imgObj.url : "http://placehold.it/300x200?textN/A";
			});

			let i, j, chunkedArray = [], chunk = 4;
			for (i=0, j=0; i < posts.length; i += chunk, j++) {
				chunkedArray[j] = posts.slice(i, i+chunk);
			}
			return chunkedArray;
		}
	}
});

const SECTIONS = "home, arts, automobiles, books, business, fashion, food, health, insider, magazine, movies, national, nyregion, obituaries, opinion, politics, realestate, science, sports, sundayreview, technology, theater, tmagazine, travel, upshot, world"

const vm = new Vue({
	el: "#app",
	data: {
		results: [],
		sections: SECTIONS.split(", "),
		section: "home"
	},
	mounted () {
		this.getPosts(this.section)
	},
	methods: {
		getPosts(section) {
			let url = buildUrl(section);
			axios.get(url).then((response) => {
				this.results = response.data.results;
			}).catch(error => { console.log(error); });
		}
	},
});