// Each project is a fake-food sample in the cabinet.
// `images` paths live in /public/projects/<id>/ — add screenshots there.
export const projects = [
  {
    id: 'monte-cristo',
    no: 1,
    title: 'The Count of Monte Cristo',
    dish: 'Monte Cristo sandwich',
    food: 'sandwich',
    summary: "Network science on Dumas' novel — who really holds the plot together?",
    description:
      "An interactive network analysis of the characters in Alexandre Dumas' The Count of Monte Cristo. 22 characters and 38 relationships are modelled as a graph, and every metric is computed from scratch in vanilla JavaScript, then presented in a 19th-century Parisian archive aesthetic.",
    highlights: [
      'Draggable D3 force-directed graph with hover tooltips and a character detail panel',
      "Brandes' betweenness, closeness, degree centrality and clustering coefficient",
      'BFS shortest-path finder and a distance-matrix heatmap',
      'Auto-generated insights: hub dominance, brokers, family clusters, small-world properties',
    ],
    stack: ['D3.js v7', 'Chart.js', 'JavaScript', 'Graph algorithms'],
    links: {
      demo: 'https://beyza1tozman.github.io/count-of-monte-cristo-network-analysis/',
      repo: 'https://github.com/beyza1tozman/count-of-monte-cristo-network-analysis',
    },
    images: [{ src: '/projects/monte-cristo/01.png', alt: 'Character network graph with Edmond Dantès at the centre' }],
  },
  {
    id: 'alloy',
    no: 2,
    title: 'Alloy Dashboard',
    dish: 'Layered parfait',
    food: 'parfait',
    summary: 'Visual analytics for recycled aluminium — every layer is a mixing ratio.',
    description:
      'A visual analytics dashboard exploring how mixing ratios of recycled aluminium scrap affect alloy performance. Built on the IEEE SciVis Contest 2025 Rapid Alloy Dataset (324k simulated compositions) for the Data Visualization course at the University of Passau, together with Muhammad Irfan. It follows Shneiderman’s mantra: overview first, zoom and filter, details on demand.',
    highlights: [
      'Violin plots, diverging bars, scrap × property heatmap and hexbin scatter plots',
      'Mechanical vs. thermophysical trade-off view with a Pareto frontier and brushing',
      'Linked views: selecting or hovering a scrap type highlights it everywhere',
      'Fast on 324k rows: OffscreenCanvas caching, incremental rendering, hex binning',
    ],
    stack: ['D3.js v7', 'Canvas', 'JavaScript', 'Visual analytics'],
    links: {
      demo: 'https://beyza1tozman.github.io/uni-passau-data-visualization-alloy-dashboard/',
      repo: 'https://github.com/beyza1tozman/uni-passau-data-visualization-alloy-dashboard',
    },
    images: [{ src: '/projects/alloy/01.png', alt: 'Dashboard with violin plots of scrap mixing ratios, a property deviation chart and a scrap × property heatmap' }],
  },
  {
    id: 'book-rec',
    no: 3,
    title: 'Book Recommendation Game',
    dish: 'Pancake stack',
    food: 'pancakes',
    summary: 'A little bookshop that knows your taste — stacked like pancakes.',
    description:
      'A bookshop-themed web game that recommends books by what they are about rather than what is popular. Descriptions of 7,000 books are vectorized with TF-IDF and compared with cosine similarity; books outside the dataset are fetched live from the Google Books API to solve the cold-start problem. All 2D art was drawn by me.',
    highlights: [
      'Content-based filtering with TF-IDF and a cosine similarity matrix',
      'Cold-start handling via the Google Books API',
      'FastAPI backend serving the recommendation engine',
      'Hand-drawn 2D bookshop art for the frontend',
    ],
    stack: ['Python', 'scikit-learn', 'FastAPI', 'NLTK', 'JavaScript'],
    links: {
      demo: 'https://beyza1tozman.github.io/Book-Recommendation-Game/',
      repo: 'https://github.com/beyza1tozman/Book-Recommendation-Game',
    },
    images: [{ src: '/projects/book-rec/01.png', alt: 'Hand-drawn red bookshop front with an owl in a scarf holding a cup' }],
  },
  {
    id: 'blog',
    no: 4,
    title: 'My Blog',
    dish: 'Melon cream soda',
    food: 'soda',
    summary: 'Where I write things down — fizzy notes on code and life.',
    description:
      'My personal blog, built with Astro and deployed on Netlify. A fast, content-first static site where I write about what I am learning and building.',
    highlights: [
      'Static site generation with Astro',
      'Content-first, lightweight pages',
      'Continuous deployment on Netlify',
    ],
    stack: ['Astro', 'JavaScript', 'Netlify'],
    links: {
      demo: 'https://beyzatozman.netlify.app',
      repo: 'https://github.com/beyza1tozman/beyzatozman-blog',
    },
    images: [{ src: '/projects/blog/01.png', alt: 'Blog home page with a colour-grid header' }],
  },
]

export const projectById = Object.fromEntries(projects.map((p) => [p.id, p]))
