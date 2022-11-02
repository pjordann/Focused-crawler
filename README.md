# Focused crawler

<!-- ABOUT THE PROJECT AND TECHNOLOGIES-->
## About The Project

![Architecture](https://github.com/pjordann/Focused-crawler/blob/main/images/imagen_abstract.png)

Due to various reasons, such as platform limitations, poor quality data or poor management, it is currently difficult to search for quality information on public web portals. Generally, the search engines of web portals (sometimes built above Google technology) are not able to categorize the pages correctly. In addition to this, they often do not have the ability to filter information by pages containing forms or different types of files. In fact, even the results offered to the user are usually quite poor and inconclusive. The result of all this is that currently, much of the information that is offered on public portals (and that third parties give value to), is hidden.

This project seeks to help solve this problem by developing a system composed of a web crawler, a set of processes responsible for information processing and a search engine. The crawler (extending its default functionality) retrieves the portal pages, the information processing system classifies and annotates those that have to do with databases or data files, and the search engine allows searching on the resources that have been processed by the previous system. In this way, it is possible to have a portal where documents containing "databases" can be found more easily, i.e., data access and search is facilitated, an aspect that plays a very important role in today's information society.

This projects aims to:
* Extract data from [Minsterio de Agricultura, Pesca y Alimentación](https://www.mapa.gob.es/es/) web portal
* Configure the crawler to behave exactly as it is required
* After being extracted, data must be analyze and processed correctly
* At the end, user must be able to make advanced searches interactively over this data

### Built With

* [![React][React.js]][React-url]
* [![Material--UI][MaterialUI]][MaterialUI-url]
* [![Node][Node.js]][Node-url]
* [![Python][Python]][Python-url]
* [![Java][Java]][Java-url]

<!-- GETTING STARTED -->
## Getting Started

To set up project locally, you will need to have some tools installed

* node
  ```sh
  node -v
  ```

* npm
  ```sh
  npm -v
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/pjordann/Focused-crawler
   ```
2. Install NPM packages
   ```sh
   cd Focused-crawler/cliente
   ```
   ```sh
   npm install
   ```
   ```sh
   cd Focused-crawler/backend
   ```
   ```sh
   npm install
3. See results by accessing [here](http://localhost:3003/)

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<!-- CONTACT -->
## Contact

Pablo Jordán Lucia - [Linkedin profile](www.linkedin.com/in/pablo-jordán-b15ab1226) - pjordanlucia@gmail.com

Project Link: [https://github.com/pjordann/Focused-crawler](https://github.com/pjordann/Focused-crawler)

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[MaterialUI]: https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white
[MaterialUI-url]: https://mui.com/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en/
[Python]: https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
[Java]: https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white
[Java-url]: https://www.java.com/es/