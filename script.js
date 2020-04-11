async function getSearchResult(event) {
    try {
        console.log(event);
        console.log("searching...");
        let search_empty = document.getElementById('search-empty');
        let search_process = document.getElementById('search-process');
        let search_table_container = document.getElementById('search-table-container');
        let search_table = document.getElementById('search-table');
        if (event.target.value) {
            search_process.style.display = "block";
            search_empty.style.display = "none";
            search_table_container.style.display = "none";

            let result = await fetch(
                "http://127.0.0.1:5000/vw-search",
                {
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        'searchPhrase': event.target.value
                    }),
                    method: 'POST'
                }
            );
            let json_res = await result.json();
            
            //flust search table
            search_table.innerHTML = '';

            //attach header to search table
            let new_row = document.createElement('div');
            new_row.className = "row header red";
            let cell1 = document.createElement('div');
            cell1.className = "cell";
            cell1.innerHTML = "VW ID"
            let cell2 = document.createElement('div');
            cell2.className = "cell";
            cell2.innerHTML = "Name of the Student"
            let cell3 = document.createElement('div');
            cell3.className = "cell";
            cell3.innerHTML = "Class"
            let cell4 = document.createElement('div');
            cell4.className = "cell";
            cell4.innerHTML = "Date of Joining"
            let cell5 = document.createElement('div');
            cell5.className = "cell";
            cell5.innerHTML = "Skills"
            new_row.appendChild(cell1);
            new_row.appendChild(cell2);
            new_row.appendChild(cell3);
            new_row.appendChild(cell4);
            new_row.appendChild(cell5);
            search_table.appendChild(new_row);
            console.log(json_res);
            json_res.data.forEach((student, index) => {
                console.log(student)
                let new_row = document.createElement('div');
                new_row.className = "row";
                let cell1 = document.createElement('div');
                cell1.className = "cell";
                cell1.innerHTML = index + 1
                let cell2 = document.createElement('div');
                cell2.className = "cell";
                cell2.innerHTML = student._source.name
                let cell3 = document.createElement('div');
                cell3.className = "cell";
                cell3.innerHTML = student._source.class
                let cell4 = document.createElement('div');
                cell4.className = "cell";
                cell4.innerHTML = student._source.date_of_joining
                let cell5 = document.createElement('div');
                cell5.className = "cell";
                let skills = ""
                student._source.skills.forEach((skill, i) => {
                    skills += skill.name;
                    if (i < student._source.skills.length - 1)
                        skills += ", ";
                })
                cell5.innerHTML = skills
                new_row.appendChild(cell1);
                new_row.appendChild(cell2);
                new_row.appendChild(cell3);
                new_row.appendChild(cell4);
                new_row.appendChild(cell5);
                search_table.appendChild(new_row);
            })

            search_process.style.display = "none";
            search_table_container.style.display = "block";
        } else {
            search_process.style.display = "none";
            search_table_container.style.display = "none";
            search_empty.style.display = "block";
        }
    }
    catch (error) {
        console.log(error)
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    let search_table_container = document.getElementById('search-table-container');
    let search_process = document.getElementById('search-process');
    search_table_container.style.display = "none";
    search_process.style.display = "none";
})