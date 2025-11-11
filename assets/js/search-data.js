// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/al-folio/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/al-folio/blog/";
          },
        },{id: "dropdown-school-projects",
              title: "school projects",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/al-folio/school-projects/";
              },
            },{id: "dropdown-personal-projects",
              title: "personal projects",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/al-folio/personal-projects/";
              },
            },{id: "nav-repositories",
          title: "repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/al-folio/repositories/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/al-folio/cv/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Materials for courses you taught. Replace this text with your description.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/al-folio/teaching/";
          },
        },{id: "nav-typewriters",
          title: "typewriters",
          description: "My typewriter collection and related projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/al-folio/typewriters/";
          },
        },{id: "nav-people",
          title: "people",
          description: "members of the lab or group",
          section: "Navigation",
          handler: () => {
            window.location.href = "/al-folio/people/";
          },
        },{id: "dropdown-bookshelf",
              title: "bookshelf",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/al-folio/books/";
              },
            },{id: "dropdown-blog",
              title: "blog",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/al-folio/blog/";
              },
            },{id: "post-senior-capstone-ev-battery-management-and-swapping-system",
        
          title: "Senior Capstone - EV Battery Management and Swapping System",
        
        description: "Ongoing senior capstone project (Fall 2025–Spring 2026): electric vehicle battery management and swapping system for continuous equipment operation.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2025/senior-capstone-ev-battery-management/";
          
        },
      },{id: "post-large-laser-cut-vernier-caliper",
        
          title: "Large Laser Cut Vernier Caliper",
        
        description: "Oversized, fully functional 33&quot; vernier caliper designed in Fusion 360, laser-cut in MDF with PETG brackets, and Python-generated scales achieving 0.01&quot; resolution.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2025/large-laser-cut-vernier-caliper/";
          
        },
      },{id: "post-a-post-with-plotly-js",
        
          title: "a post with plotly.js",
        
        description: "this is what included plotly.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2025/plotly/";
          
        },
      },{id: "post-welcome-to-my-engineering-blog",
        
          title: "Welcome to My Engineering Blog",
        
        description: "Welcome to my personal portfolio and engineering blog. This is where I&#39;ll share my projects, thoughts, and experiences.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2025/welcome/";
          
        },
      },{id: "post-open-ended-experiment-tensile-testing-of-acrylic-with-geometric-discontinuities",
        
          title: "Open-Ended Experiment - Tensile Testing of Acrylic with Geometric Discontinuities",
        
        description: "Investigated how cast acrylic specimens with holes and notches respond to tensile loading using Instron testing and stress concentration analysis.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/acrylic-tensile-test/";
          
        },
      },{id: "post-analog-voltmeter-clock-time-and-environmental-monitor",
        
          title: "Analog Voltmeter Clock - Time and Environmental Monitor",
        
        description: "A unique clock project combining analog voltmeters with environmental monitoring, featuring custom 3D-printed enclosure and Arduino-based control system.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/analog-voltmeter-clock/";
          
        },
      },{id: "post-a-post-with-image-galleries",
        
          title: "a post with image galleries",
        
        description: "this is what included image galleries could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/photo-gallery/";
          
        },
      },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-a-post-with-tabs",
        
          title: "a post with tabs",
        
        description: "this is what included tabs in a post could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/tabs/";
          
        },
      },{id: "post-a-post-with-typograms",
        
          title: "a post with typograms",
        
        description: "this is what included typograms code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/typograms/";
          
        },
      },{id: "post-a-post-that-can-be-cited",
        
          title: "a post that can be cited",
        
        description: "this is what a post that can be cited looks like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/post-citation/";
          
        },
      },{id: "post-a-post-with-pseudo-code",
        
          title: "a post with pseudo code",
        
        description: "this is what included pseudo code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/pseudocode/";
          
        },
      },{id: "post-a-post-with-code-diff",
        
          title: "a post with code diff",
        
        description: "this is how you can display code diffs",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/code-diff/";
          
        },
      },{id: "post-a-post-with-advanced-image-components",
        
          title: "a post with advanced image components",
        
        description: "this is what advanced image components could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/advanced-images/";
          
        },
      },{id: "post-a-post-with-vega-lite",
        
          title: "a post with vega lite",
        
        description: "this is what included vega lite code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/vega-lite/";
          
        },
      },{id: "post-a-post-with-geojson",
        
          title: "a post with geojson",
        
        description: "this is what included geojson code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/geojson-map/";
          
        },
      },{id: "post-a-post-with-echarts",
        
          title: "a post with echarts",
        
        description: "this is what included echarts code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/echarts/";
          
        },
      },{id: "post-a-post-with-chart-js",
        
          title: "a post with chart.js",
        
        description: "this is what included chart.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2024/chartjs/";
          
        },
      },{id: "post-a-post-with-tikzjax",
        
          title: "a post with TikZJax",
        
        description: "this is what included TikZ code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2023/tikzjax/";
          
        },
      },{id: "post-a-post-with-bibliography",
        
          title: "a post with bibliography",
        
        description: "an example of a blog post with bibliography",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2023/post-bibliography/";
          
        },
      },{id: "post-a-post-with-jupyter-notebook",
        
          title: "a post with jupyter notebook",
        
        description: "an example of a blog post with jupyter notebook",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2023/jupyter-notebook/";
          
        },
      },{id: "post-a-post-with-custom-blockquotes",
        
          title: "a post with custom blockquotes",
        
        description: "an example of a blog post with custom blockquotes",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2023/custom-blockquotes/";
          
        },
      },{id: "post-a-post-with-table-of-contents-on-a-sidebar",
        
          title: "a post with table of contents on a sidebar",
        
        description: "an example of a blog post with table of contents on a sidebar",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2023/sidebar-table-of-contents/";
          
        },
      },{id: "post-a-post-with-audios",
        
          title: "a post with audios",
        
        description: "this is what included audios could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2023/audios/";
          
        },
      },{id: "post-a-post-with-videos",
        
          title: "a post with videos",
        
        description: "this is what included videos could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2023/videos/";
          
        },
      },{id: "post-displaying-beautiful-tables-with-bootstrap-tables",
        
          title: "displaying beautiful tables with Bootstrap Tables",
        
        description: "an example of how to use Bootstrap Tables",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2023/tables/";
          
        },
      },{id: "post-a-post-with-table-of-contents",
        
          title: "a post with table of contents",
        
        description: "an example of a blog post with table of contents",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2023/table-of-contents/";
          
        },
      },{id: "post-a-post-with-giscus-comments",
        
          title: "a post with giscus comments",
        
        description: "an example of a blog post with giscus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2022/giscus-comments/";
          
        },
      },{id: "post-cad-project-self-propelled-wall-leaper",
        
          title: "CAD Project - Self-Propelled Wall Leaper",
        
        description: "A detailed CAD design project from my Intro to Engineering course, where I designed and built a self-propelled device that launches over a 3-foot wall using rubber band power and 3D printed components.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2022/cad-project/";
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "post-a-post-with-redirect",
        
          title: "a post with redirect",
        
        description: "you can also redirect to assets like pdf",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/assets/pdf/example_pdf.pdf";
          
        },
      },{id: "post-a-post-with-diagrams",
        
          title: "a post with diagrams",
        
        description: "an example of a blog post with diagrams",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2021/diagrams/";
          
        },
      },{id: "post-a-distill-style-blog-post",
        
          title: "a distill-style blog post",
        
        description: "an example of a distill-style blog post and main elements",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2021/distill/";
          
        },
      },{id: "post-a-post-with-twitter",
        
          title: "a post with twitter",
        
        description: "an example of a blog post with twitter",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2020/twitter/";
          
        },
      },{id: "post-a-post-with-disqus-comments",
        
          title: "a post with disqus comments",
        
        description: "an example of a blog post with disqus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2015/disqus-comments/";
          
        },
      },{id: "post-a-post-with-math",
        
          title: "a post with math",
        
        description: "an example of a blog post with some math",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2015/math/";
          
        },
      },{id: "post-a-post-with-code",
        
          title: "a post with code",
        
        description: "an example of a blog post with some code",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2015/code/";
          
        },
      },{id: "post-a-post-with-images",
        
          title: "a post with images",
        
        description: "this is what included images could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2015/images/";
          
        },
      },{id: "post-a-post-with-formatting-and-links",
        
          title: "a post with formatting and links",
        
        description: "march &amp; april, looking forward to summer",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/al-folio/blog/2015/formatting-and-links/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/al-folio/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/al-folio/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/al-folio/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/al-folio/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/al-folio/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/al-folio/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/al-folio/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/al-folio/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/al-folio/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/al-folio/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/al-folio/projects/9_project/";
            },},{id: "typewriters-bennett-pocket-typewriter",
          title: 'Bennett Pocket Typewriter',
          description: "Bennett Pocket Typewriter (1910) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/bennett-pocket-typewriter-14682/";
            },},{id: "typewriters-bennett-pocket-typewriter",
          title: 'Bennett Pocket Typewriter',
          description: "Bennett Pocket Typewriter (1910) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/bennett-pocket-typewriter-18627/";
            },},{id: "typewriters-blickensderfer-no-5",
          title: 'Blickensderfer no. 5',
          description: "Blickensderfer no. 5 (1909) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/blickensderfer-no-5-133130/";
            },},{id: "typewriters-blickensderfer-no-8",
          title: 'Blickensderfer no. 8',
          description: "Blickensderfer no. 8 (1909) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/blickensderfer-no-8-135255/";
            },},{id: "typewriters-continental-standard",
          title: 'Continental Standard',
          description: "Continental Standard (1911) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/continental-standard-26277/";
            },},{id: "typewriters-corona-3",
          title: 'Corona 3',
          description: "Corona 3 (1919) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/corona-3-231258/";
            },},{id: "typewriters-facit-t1",
          title: 'Facit T1',
          description: "Facit T1 (1959) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/facit-t1-t1-123221/";
            },},{id: "typewriters-facit-tp1",
          title: 'Facit TP1',
          description: "Facit TP1 (1961) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/facit-tp1-p287156/";
            },},{id: "typewriters-facit-tp1",
          title: 'Facit TP1',
          description: "Facit TP1 (1965) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/facit-tp1-p411069/";
            },},{id: "typewriters-hammond-model-1",
          title: 'Hammond Model 1',
          description: "Hammond Model 1 (1890) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/hammond-model-1-15058/";
            },},{id: "typewriters-hammond-multiplex",
          title: 'Hammond Multiplex',
          description: "Hammond Multiplex (1913) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/hammond-multiplex-224478/";
            },},{id: "typewriters-hammond-multiplex",
          title: 'Hammond Multiplex',
          description: "Hammond Multiplex (1915) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/hammond-multiplex-cc231416/";
            },},{id: "typewriters-harris-visible-no-4",
          title: 'Harris Visible no. 4',
          description: "Harris Visible no. 4 (1912) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/harris-visible-no-4-19149/";
            },},{id: "typewriters-ibm-model-04-executive",
          title: 'IBM Model 04 Executive',
          description: "IBM Model 04 Executive (1947) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/ibm-model-04-executive-180437/";
            },},{id: "typewriters-junior-spain-model-58",
          title: 'Junior (Spain) Model 58',
          description: "Junior (Spain) Model 58 typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/junior-spain-model-58-c2492/";
            },},{id: "typewriters-mignon-no-4",
          title: 'Mignon No. 4',
          description: "Mignon No. 4 (1925) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/mignon-no-4-352222/";
            },},{id: "typewriters-olympia-sg1",
          title: 'Olympia SG1',
          description: "Olympia SG1 (1959) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/olympia-sg1-7-487163/";
            },},{id: "typewriters-olympia-sm3",
          title: 'Olympia SM3',
          description: "Olympia SM3 (1958) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/olympia-sm3-1205390/";
            },},{id: "typewriters-olympia-sm4",
          title: 'Olympia SM4',
          description: "Olympia SM4 (1954) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/olympia-sm4-490865/";
            },},{id: "typewriters-postal-no-3",
          title: 'Postal No. 3',
          description: "Postal No. 3 (1901) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/postal-no-3-14550/";
            },},{id: "typewriters-remington-17",
          title: 'Remington 17',
          description: "Remington 17 (1946) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/remington-17-j794385/";
            },},{id: "typewriters-remington-portable-model-1",
          title: 'Remington Portable Model 1',
          description: "Remington Portable Model 1 typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/remington-portable-model-1-na13437/";
            },},{id: "typewriters-royal-de-luxe",
          title: 'Royal De Luxe',
          description: "Royal De Luxe (1936) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/royal-de-luxe-a597665/";
            },},{id: "typewriters-royal-quiet-de-luxe",
          title: 'Royal Quiet De Luxe',
          description: "Royal Quiet De Luxe (1939) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/royal-quiet-de-luxe-a-873792/";
            },},{id: "typewriters-smith-corona-clipper",
          title: 'Smith Corona Clipper',
          description: "Smith Corona Clipper (1952) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/smith-corona-clipper-5c218668/";
            },},{id: "typewriters-sun-no-2-standard",
          title: 'Sun No. 2 Standard',
          description: "Sun No. 2 Standard (1901) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/sun-no-2-standard-8278/";
            },},{id: "typewriters-triumph-de-jur-perfekt",
          title: 'Triumph De Jur Perfekt',
          description: "Triumph De Jur Perfekt (1960) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/triumph-de-jur-perfekt-1228617/";
            },},{id: "typewriters-underwood-4-bank",
          title: 'Underwood 4 Bank',
          description: "Underwood 4 Bank (1926) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/underwood-4-bank-4b7867/";
            },},{id: "typewriters-underwood-champion-typemaster",
          title: 'Underwood Champion Typemaster',
          description: "Underwood Champion Typemaster (1938) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/underwood-champion-typemaster-g1130193/";
            },},{id: "typewriters-underwood-no-3",
          title: 'Underwood No. 3',
          description: "Underwood No. 3 (1917) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/underwood-no-3-206803/";
            },},{id: "typewriters-underwood-quiet-tab",
          title: 'Underwood Quiet Tab',
          description: "Underwood Quiet Tab (1953) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/underwood-quiet-tab-aa2730434/";
            },},{id: "typewriters-woodstock-model-5n",
          title: 'Woodstock Model 5N',
          description: "Woodstock Model 5N (1927) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/al-folio/typewriters/woodstock-model-5n-n168116e/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6C%65%6F%6E%61%72%64.%63%68%61%75@%79%61%68%6F%6F.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-facebook',
        title: 'Facebook',
        section: 'Socials',
        handler: () => {
          window.open("https://facebook.com/dairyking98", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/dairyking98", "_blank");
        },
      },{
        id: 'social-instagram',
        title: 'Instagram',
        section: 'Socials',
        handler: () => {
          window.open("https://instagram.com/typemealetter", "_blank");
        },
      },{
        id: 'social-whatsapp',
        title: 'whatsapp',
        section: 'Socials',
        handler: () => {
          window.open("https://wa.me/15104614851", "_blank");
        },
      },{
        id: 'social-youtube',
        title: 'YouTube',
        section: 'Socials',
        handler: () => {
          window.open("https://youtube.com/@dairyking98", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
