let selectedFile;
let data = [{}];
var advisor = "";
var advisorName = "";
var students = [{}];
var entry_year;
var entry_trimester;
const url = "https://api.welkin.app/v1/student/new";

document.getElementById('input').addEventListener("change", (event) => {
    console.log(event);
    selectedFile = event.target.files[0];
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, {
                type: "binary"
            });
            var select = document.getElementById("sheetName");
            select.textContent="";
            var sheetNames = workbook.SheetNames;
            for (const val of sheetNames) {
                var option = document.createElement("option");
                option.val = val;
                option.text = val.toUpperCase();
                select.appendChild(option);
            }
        }
    }

});

document.getElementById('convert_button').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    students = [];
    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, {
                type: "binary"
            });
            var select = document.getElementById("sheetName");
            let year = select.value;
            [entry_year,entry_trimester] = year.split("T");
            let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[select.value]);
            var table = document.getElementById("myTable");
            table.innerHTML = "";
            for (var count in rowObject) {
                students.push(rowObject[count]);
                advisor = rowObject[count].Advisor;
                var a = (typeof(advisor.lastIndexOf("."))!=='undefined') ? advisor.lastIndexOf("."): 0;
                advisorName = advisor.substring(a + 1);
                var row = table.insertRow(count);
                row.insertCell(0).innerHTML = rowObject[count].ID;
                row.insertCell(1).innerHTML = rowObject[count].Program;
                row.insertCell(2).innerHTML = rowObject[count].Prefix;
                row.insertCell(3).innerHTML = rowObject[count].Name;
                row.insertCell(4).innerHTML = rowObject[count].LastName;
                row.insertCell(5).innerHTML = advisorName;
            }
        }
    }
});

document.getElementById("submit_Button").addEventListener("click",async ()=>{
    console.log(students);
    for (each in students){
        let student = {
            sid: students[each].ID,
            prefix: students[each].Prefix, 
            first_name: students[each].Name,
            last_name: students[each].LastName,
            program: students[each].Program,
            entry_trimester,
            entry_year
        }
        console.log(JSON.stringify(student)); 
        await axios.post(url,JSON.stringify(student),{
            headers:{
                "Content-Type" : "application/json"
            }
        }).then(res=>{
            console.log(res);
        }).catch(err => {console.log(err);}) 
    }
});