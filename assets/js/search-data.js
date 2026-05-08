// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "dropdown-school-projects",
              title: "school projects",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/school-projects/";
              },
            },{id: "dropdown-personal-projects",
              title: "personal projects",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/personal-projects/";
              },
            },{id: "dropdown-3d-type-elements",
              title: "3d type elements",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/3d-type-elements/";
              },
            },{id: "dropdown-photography",
              title: "photography",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/photography/";
              },
            },{id: "nav-repositories",
          title: "repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "dropdown-typewriters",
              title: "typewriters",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/typewriter-collection/";
              },
            },{id: "dropdown-fraction-inch-millimeter-chart",
              title: "fraction inch millimeter chart",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/fraction-inch-mm-chart/";
              },
            },{id: "dropdown-thread-size-chart",
              title: "thread size chart",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/thread-size-chart/";
              },
            },{id: "dropdown-differential-growth",
              title: "differential growth",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/differential-growth/";
              },
            },{id: "dropdown-music-visualizer",
              title: "music visualizer",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/music-visualizer/";
              },
            },{id: "post-stability-commander",
        
          title: "Stability COMmander",
        
        description: "Real-time telehandler stability control prototype tracking vehicle–load center of mass against the support polygon — STM32 embedded logic, MATLAB/Simulink HIL, Pygame visualization, and a fabricated boom prototype.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/stability-commander/";
          
        },
      },{id: "post-mingkwai-rediscovered-a-symposium-on-the-revolutionary-chinese-typewriter",
        
          title: "MingKwai, Rediscovered - A Symposium on the Revolutionary Chinese Typewriter",
        
        description: "Reflections on attending the MingKwai symposium at Stanford, exploring the history and impact of Lin Yutang&#39;s revolutionary Chinese typewriter prototype.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/mingkwai-rediscovered-symposium/";
          
        },
      },{id: "post-music-visualizer-instant-milkdrop-in-your-browser",
        
          title: "Music Visualizer - Instant Milkdrop in Your Browser",
        
        description: "A browser-ready music visualizer powered by Butterchurn, bringing the classic Milkdrop experience to internet radio and your own music files.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/music-visualizer/";
          
        },
      },{id: "post-my-phd-application-journey",
        
          title: "My PhD Application Journey",
        
        description: "An update on my PhD application process and what I&#39;ve learned along the way.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/phd-applications/";
          
        },
      },{id: "post-building-hpwriter-a-silent-digital-typewriter",
        
          title: "Building HPWriter - A Silent Digital Typewriter",
        
        description: "Why I&#39;m building HPWriter, a silent digital typewriter that prints on plain paper, and what inspired this project.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/hpwriter-project/";
          
        },
      },{id: "post-welcome-to-my-engineering-blog",
        
          title: "Welcome to My Engineering Blog",
        
        description: "Welcome to my personal portfolio and engineering blog. This is where I&#39;ll share my projects, thoughts, and experiences.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/welcome/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-images-and-content-coming-soon-once-my-phd-applications-are-submitted-in-december-i-ll-be-populating-the-site-with-photos-project-details-and-more-content-the-site-is-actively-under-construction-thank-you-for-your-patience",
          title: 'Images and content coming soon! Once my PhD applications are submitted in December,...',
          description: "",
          section: "News",},{id: "news-i-ve-written-about-my-ongoing-phd-application-process-read-about-my-experience-reflections-and-what-s-next-my-phd-application-journey",
          title: 'I’ve written about my ongoing PhD application process. Read about my experience, reflections,...',
          description: "",
          section: "News",},{id: "projects-bennett-type-elements",
          title: 'Bennett Type Elements',
          description: "3D-printed replacement type elements for Bennett Pocket Typewriters, restoring functionality to machines with damaged or lost original vulcanized rubber elements",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3d-type-elements/bennett-type-elements/";
            },},{id: "projects-blickensderfer-typewheels",
          title: 'Blickensderfer Typewheels',
          description: "Brand-new 3D-printed replacement type elements for antique Blickensderfer typewriters, featuring typefaces never before available for these machines",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3d-type-elements/blickensderfer-typewheels/";
            },},{id: "projects-helios-klimax-type-elements",
          title: 'Helios Klimax Type Elements',
          description: "3D-printed replacement type elements for the unusual Helios Klimax Typewriter from Germany, developed through collaborative design and iteration with a collector friend",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3d-type-elements/helios-klimax-type-elements/";
            },},{id: "projects-ibm-selectric-type-elements",
          title: 'IBM Selectric Type Elements',
          description: "Parametric 3D-printed replacement type elements for IBM Selectric typewriters, with support for any keyboard layout, font, and key arrangement",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3d-type-elements/ibm-selectric-type-elements/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/fun/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/fun/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/fun/6_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/fun/9_project/";
            },},{id: "projects-hpwriter-silent-digital-typewriter",
          title: 'HPWriter - Silent Digital Typewriter',
          description: "A modern, silent typewriter that prints on plain paper using an HP45 inkjet cartridge. Features instant boot, USB keyboard input, USB flash drive support, and ultra-quiet operation.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/personal-project/hpwriter/";
            },},{id: "projects-large-laser-cut-vernier-caliper",
          title: 'Large Laser Cut Vernier Caliper',
          description: "Oversized, fully functional 33&quot; vernier caliper designed in Fusion 360, laser-cut in MDF with PETG brackets, and Python-generated scales achieving 0.01&quot; resolution.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/personal-project/large-laser-cut-vernier-caliper/";
            },},{id: "projects-3d-cam",
          title: '3D-Cam',
          description: "E-Lab SFSU project for 3D camera applications",
          section: "Projects",handler: () => {
              window.location.href = "/projects/school-project/3d-cam/";
            },},{id: "projects-acrylic-tensile-testing",
          title: 'Acrylic Tensile Testing',
          description: "Investigated how cast acrylic specimens with holes and notches respond to tensile loading using Instron testing and stress concentration analysis.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/school-project/acrylic-tensile-testing/";
            },},{id: "projects-analog-voltmeter-clock",
          title: 'Analog Voltmeter Clock',
          description: "A unique clock project combining analog voltmeters with environmental monitoring, featuring custom 3D-printed enclosure and Arduino-based control system.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/school-project/analog-voltmeter-clock/";
            },},{id: "projects-self-propelled-wall-leaper",
          title: 'Self-Propelled Wall Leaper',
          description: "A detailed CAD design project from my Intro to Engineering course, where I designed and built a self-propelled device that launches over a 3-foot wall using rubber band power and 3D printed components.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/school-project/cad-project-self-propelled-wall-leaper/";
            },},{id: "projects-fluorcam",
          title: 'FluorCam',
          description: "FluorCam system based on RoboCam, adapted for fluorescence imaging applications",
          section: "Projects",handler: () => {
              window.location.href = "/projects/school-project/fluorcam/";
            },},{id: "projects-robocam",
          title: 'RoboCam',
          description: "RoboCam system for automated camera control and 3D printer integration",
          section: "Projects",handler: () => {
              window.location.href = "/projects/school-project/robocam/";
            },},{id: "projects-ev-battery-management-system",
          title: 'EV Battery Management System',
          description: "Ongoing senior capstone project (Fall 2025–Spring 2026): electric vehicle battery management and swapping system for continuous equipment operation.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/school-project/senior-capstone-ev-battery-management/";
            },},{id: "projects-stentorcam",
          title: 'StentorCam',
          description: "StentorCam system based on RoboCam, with well plate support for biological imaging applications",
          section: "Projects",handler: () => {
              window.location.href = "/projects/school-project/stentorcam/";
            },},{id: "projects-voltmeter-clock-arduino-code",
          title: 'Voltmeter Clock Arduino Code',
          description: "Complete Arduino source code for the Voltmeter Clock project with detailed comments",
          section: "Projects",handler: () => {
              window.location.href = "/vmeter-clock/code/";
            },},{id: "projects-voltmeter-clock-documentation",
          title: 'Voltmeter Clock Documentation',
          description: "Complete documentation for the Voltmeter Clock project including hardware setup, pin configuration, and functionality",
          section: "Projects",handler: () => {
              window.location.href = "/vmeter-clock/documentation/";
            },},{id: "projects-voltmeter-clock-operation-guide",
          title: 'Voltmeter Clock Operation Guide',
          description: "Quick reference guide for operating the voltmeter clock",
          section: "Projects",handler: () => {
              window.location.href = "/vmeter-clock/operation-guide/";
            },},{id: "projects-voltmeter-clock-technical-documentation",
          title: 'Voltmeter Clock Technical Documentation',
          description: "Detailed technical documentation including code architecture, algorithms, and implementation details",
          section: "Projects",handler: () => {
              window.location.href = "/vmeter-clock/technical/";
            },},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/work/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/work/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/work/3_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/work/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/work/8_project/";
            },},{id: "typewriters-bennett-pocket-typewriter",
          title: 'Bennett Pocket Typewriter',
          description: "Bennett Pocket Typewriter (1910) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/bennett-pocket-typewriter-14682/";
            },},{id: "typewriters-bennett-pocket-typewriter",
          title: 'Bennett Pocket Typewriter',
          description: "Bennett Pocket Typewriter (1910) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/bennett-pocket-typewriter-18627/";
            },},{id: "typewriters-blickensderfer-no-5",
          title: 'Blickensderfer no. 5',
          description: "Blickensderfer no. 5 (1909) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/blickensderfer-no-5-133130/";
            },},{id: "typewriters-blickensderfer-no-8",
          title: 'Blickensderfer no. 8',
          description: "Blickensderfer no. 8 (1909) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/blickensderfer-no-8-135255/";
            },},{id: "typewriters-continental-standard",
          title: 'Continental Standard',
          description: "Continental Standard (1911) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/continental-standard-26277/";
            },},{id: "typewriters-corona-3",
          title: 'Corona 3',
          description: "Corona 3 (1919) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/corona-3-231258/";
            },},{id: "typewriters-facit-t1",
          title: 'Facit T1',
          description: "Facit T1 (1959) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/facit-t1-t1-123221/";
            },},{id: "typewriters-facit-tp1",
          title: 'Facit TP1',
          description: "Facit TP1 (1961) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/facit-tp1-p287156/";
            },},{id: "typewriters-facit-tp1",
          title: 'Facit TP1',
          description: "Facit TP1 (1965) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/facit-tp1-p411069/";
            },},{id: "typewriters-hammond-model-1",
          title: 'Hammond Model 1',
          description: "Hammond Model 1 (1890) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/hammond-model-1-15058/";
            },},{id: "typewriters-hammond-multiplex",
          title: 'Hammond Multiplex',
          description: "Hammond Multiplex (1913) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/hammond-multiplex-224478/";
            },},{id: "typewriters-hammond-multiplex",
          title: 'Hammond Multiplex',
          description: "Hammond Multiplex (1915) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/hammond-multiplex-cc231416/";
            },},{id: "typewriters-harris-visible-no-4",
          title: 'Harris Visible no. 4',
          description: "Harris Visible no. 4 (1912) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/harris-visible-no-4-19149/";
            },},{id: "typewriters-ibm-model-04-executive",
          title: 'IBM Model 04 Executive',
          description: "IBM Model 04 Executive (1947) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/ibm-model-04-executive-180437/";
            },},{id: "typewriters-junior-spain-model-58",
          title: 'Junior (Spain) Model 58',
          description: "Junior (Spain) Model 58 typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/junior-spain-model-58-c2492/";
            },},{id: "typewriters-mignon-no-4",
          title: 'Mignon No. 4',
          description: "Mignon No. 4 (1925) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/mignon-no-4-352222/";
            },},{id: "typewriters-olympia-sg1",
          title: 'Olympia SG1',
          description: "Olympia SG1 (1959) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/olympia-sg1-7-487163/";
            },},{id: "typewriters-olympia-sm3",
          title: 'Olympia SM3',
          description: "Olympia SM3 (1958) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/olympia-sm3-1205390/";
            },},{id: "typewriters-olympia-sm4",
          title: 'Olympia SM4',
          description: "Olympia SM4 (1954) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/olympia-sm4-490865/";
            },},{id: "typewriters-postal-no-3",
          title: 'Postal No. 3',
          description: "Postal No. 3 (1901) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/postal-no-3-14550/";
            },},{id: "typewriters-remington-17",
          title: 'Remington 17',
          description: "Remington 17 (1946) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/remington-17-j794385/";
            },},{id: "typewriters-remington-portable-model-1",
          title: 'Remington Portable Model 1',
          description: "Remington Portable Model 1 typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/remington-portable-model-1-na13437/";
            },},{id: "typewriters-royal-de-luxe",
          title: 'Royal De Luxe',
          description: "Royal De Luxe (1936) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/royal-de-luxe-a597665/";
            },},{id: "typewriters-royal-quiet-de-luxe",
          title: 'Royal Quiet De Luxe',
          description: "Royal Quiet De Luxe (1939) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/royal-quiet-de-luxe-a-873792/";
            },},{id: "typewriters-smith-corona-clipper",
          title: 'Smith Corona Clipper',
          description: "Smith Corona Clipper (1952) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/smith-corona-clipper-5c218668/";
            },},{id: "typewriters-sun-no-2-standard",
          title: 'Sun No. 2 Standard',
          description: "Sun No. 2 Standard (1901) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/sun-no-2-standard-8278/";
            },},{id: "typewriters-triumph-de-jur-perfekt",
          title: 'Triumph De Jur Perfekt',
          description: "Triumph De Jur Perfekt (1960) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/triumph-de-jur-perfekt-1228617/";
            },},{id: "typewriters-underwood-4-bank",
          title: 'Underwood 4 Bank',
          description: "Underwood 4 Bank (1926) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/underwood-4-bank-4b7867/";
            },},{id: "typewriters-underwood-champion-typemaster",
          title: 'Underwood Champion Typemaster',
          description: "Underwood Champion Typemaster (1938) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/underwood-champion-typemaster-g1130193/";
            },},{id: "typewriters-underwood-no-3",
          title: 'Underwood No. 3',
          description: "Underwood No. 3 (1917) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/underwood-no-3-206803/";
            },},{id: "typewriters-underwood-quiet-tab",
          title: 'Underwood Quiet Tab',
          description: "Underwood Quiet Tab (1953) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/underwood-quiet-tab-aa2730434/";
            },},{id: "typewriters-woodstock-model-5n",
          title: 'Woodstock Model 5N',
          description: "Woodstock Model 5N (1927) typewriter details.",
          section: "Typewriters",handler: () => {
              window.location.href = "/typewriters/woodstock-model-5n-n168116e/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/example_pdf.pdf", "_blank");
        },
      },{
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
