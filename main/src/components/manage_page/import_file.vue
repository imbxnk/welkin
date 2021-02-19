<template>
        <v-main fluid>
            <v-file-input accept=".xls,.xlsx" label="Choose a file" v-model="files"></v-file-input>
            <v-btn class='primary' @click="check" >test</v-btn>
            <v-select items:></v-select>
        </v-main>
</template>

<script>
    export default {
        data: () => ({
            files: [],
            sheet_data: [{}],
            selectedFile:[],
            advisor,
            advisorName: "",
            students: [{}],
            entry_year,
            entry_trimester,
            url: "https://api.welkin.app/v1/student/new",

        }),
        methods: {
            check: function(){
            selectedFile = target.files[0];
            XLSX.utils.json_to_sheet(sheet_data, 'out.xlsx');
            if (selectedFile) {
                let fileReader = new FileReader();
                fileReader.readAsBinaryString(selectedFile);
                fileReader.onload = (check) => {
                    let sheet_data = target.result;
                    let workbook = XLSX.read(sheet_data, {
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
            },
                
            }
        }
    
</script>