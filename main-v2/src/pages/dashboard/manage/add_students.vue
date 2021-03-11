<template>
    <div class="main p-4">
    <div class="container">
        <div class="row mt-3">
            <div class="col-12">
                <!-- Create a card component -->
                <div class="card">
                    <!-- card header part -->
                    <div class="card-title p-3">
                        <h2>Add new Student</h2>
                    </div>
                    <!-- card body part -->
                    <div class="card-body">
                        <!-- create a form for user to input student data -->
                        <form>
                            <!-- first row of the form.  Contain: ID, Prefix -->
                            <div class="row mt-1">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="id">Student ID</label>
                                        <input type="text" class="form-control" id="id" v-model="student.id"/>
                                    </div>
                                </div>                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="selectPrefix">Choose prefixs</label>
                                        <select class="form-control" id="selectPrefix" v-model="student.prefix">
                                            <option></option>
                                            <option>Mr</option>
                                            <option>Ms</option>
                                            <option>Mrs</option>
                                            <option>Dr</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <!-- Second row of the form.   Contain: Firstname, Familyname, Nickname -->
                            <div class="row mt-1">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="firstName">Firstname</label>
                                        <input type="text" class="form-control" id="firstName" v-model="student.firstname"/>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="familyName">Family Name</label>
                                        <input type="text" class="form-control" id="familyName" v-model="student.familyname"/>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="nickName">Nickname</label>
                                        <input type="text" class="form-control" id="nickName" v-model="student.nickname"/>
                                    </div>
                                </div>
                            </div>
                            <!-- Third row of the form. Contain: Email, entry_trimester, entry_year  -->
                            <div class="row mt-1">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input type="text" class="form-control" id="email" v-model="student.email"/>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="entryTrimester">Entry Trimester</label>
                                        <select class="form-control" id="entryTrimester" v-model="student.entry_trimester">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="entryYear">Entry Year</label>
                                        <input type="text" class="form-control" id="entryYear" v-model="student.entry_year"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-1">
                                <div class="col-6">
                                    <button class="btn btn-warning">Clear</button>
                                </div>
                                <div class="col-6">
                                <button class="btn btn-primary" @click.prevent="addStudent">Add</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Display student in the table -->
            <div class="col-12 mt-3">
                <div class="card">
                    <div class="card-title p-3">
                        <h3>Student List</h3>
                    </div>
                    <div class="card-body p-3">
                        <table class="table table-stripped table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Prefix</th>
                                    <th>Firstname</th>
                                    <th>Family name</th>
                                    <th>Nickname</th>
                                    <th>Email</th>
                                    <th>Entry Trimester</th>
                                    <th>Entry Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in tableStudent" :key="index" :value="item">
                                    <td scope="row">{{ item.id }}</td>
                                    <td scope="row">{{ item.prefix }}</td>
                                    <td scope="row">{{ item.firstname }}</td>
                                    <td scope="row">{{ item.familyname }}</td>
                                    <td scope="row">{{ item.nickname }}</td>
                                    <td scope="row">{{ item.email }}</td>
                                    <td scope="row">{{ item.entry_trimester }}</td>
                                    <td scope="row">{{ item.entry_year }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    </div>
</template>

<script>
export default {
    name: "addNewStudent",
    data(){
        return{
            student:[{
                id: "",
                prefix: "",
                firstname: "",
                familyname: "",
                nickname: "",
                email: "",
                entry_trimester: "",
                entry_year: "",
            }],
            tableStudent:[{
                id: "",
                prefix: "",
                firstname: "",
                familyname: "",
                nickname: "",
                email: "",
                entry_trimester: "",
                entry_year: "",
            }]
        }
    },
    methods: {
        addStudent(){
            console.log(this.student)
            if(this.$refs.form.validate()){ 
                this.tableStudent.push({
                    id: this.student.id,
                    prefix: this.student.prefix,
                    firstname: this.student.firstname,
                    familyname: this.student.familyname,
                    nickname: this.student.nickname,
                    email: this.student.email,
                    entry_trimester: this.student.entry_trimester,
                    entry_year: this.student.entry_year,
            })
            } 
        }
    },
}
</script>

<style>

</style>