import axios from 'axios';

const url = 'http://localhost:5000';
//Home Page
//-->Enrolling Courses
export const fetchEnrollingCourses = () => axios.get(url + `/course/enrollingCourses`)
//User related connection
export const createUser = (data, isTeacher) => axios.post(url + `/user/signup`, { data, isTeacher })
export const verifyUser = (data, isTeacher) => axios.post(url + `/user/login`, { data, isTeacher })
export const checkLogin = () => axios.get(url + `/user/check`);
export const userLogout = () => axios.get(url + `/user/logout`);
export const fetchUser = () => axios.get(url + `/user/account`);
export const editUser = (formData) => axios.post(url + `/user/edit`, formData);


//COurses related Connection
export const createCourse = (data) => axios.post(url + `/course/createcourse`, data)
export const fetchMyCourses = () => axios.get(url + `/course/mycourses`);
export const fetchMyCourseView = (id) => axios.get(url + `/course/mycourses/view/${id}`);
//fetch and search Courses
export const fetchCourses = (filter) => axios.get(url + `/course/courses/${filter}`);
export const searchCourses = (searchString, filter) => axios.get(url + `/course/courses/${filter}/${searchString}`);

export const fetchCourseView = (id) => axios.get(url + `/course/view/${id} `)
export const fetchCourseViewWL = (id) => axios.get(url + `/course/viewwl/${id} `)
export const activateCourse = (id) => axios.get(url + `/course/activate/${id} `)//change
export const deactivateCourse = (id) => axios.get(url + `/course/deactivate/${id} `)//change
export const buyCourse = (id) => axios.get(url + `/course/buy/${id} `)//change
export const addToWishList = (id) => axios.put(url + `/course/addtowishlist/${id} `)//change
export const removeFromWishList = (id) => axios.put(url + `/course/removefromwishlist/${id} `)//change

//Classes related Connection
export const createClass = (data, courseId) => axios.post(url + `/class/createclass`, { data, courseId });
export const fetchMyActiveClasses = () => axios.get(url + `/class/active/myclasses`)
export const fetchMyCompletedClasses = () => axios.get(url + `/class/completed/myclasses`)
export const fetchMyCourseClasses = (id) => axios.get(url + `/class/mycourseclasses/${id} `);
export const fetchMyClassStudents = (id) => axios.get(url + `/class/mycourseclasses/students/${id} `);
export const openClass = (id, classId) => axios.get(url + `/class/openClass/${id}/${classId}`);
export const closeClass = (id, classId) => axios.get(url + `/class/closeClass/${id}/${classId}`);
export const makeItActiveClass = (id, classId) => axios.get(url + `/class/makeItActiveClass/${id}/${classId}`);

//pots related connections
export const createPost = (formData, courseId) => axios.post(url + `/post/createpost/${courseId}`, formData);
export const fetchPosts = (classId) => axios.get(url + `/post/fetchposts/${classId}`);
export const fetchClassWork = (classId) => axios.get(url + `/post/fetchclasswork/${classId}`);
export const dowloadFile = (file, classId) => axios.get(url + `/filedownload/${classId}/${file}`, {
    responseType: 'stream'
})
export const fetchSinglePost = (classId, postId) => axios.get(url + `/post/fetchpost/${classId}/${postId}`);
//task
export const submitTask = (formData, id, taskId) => axios.post(url + `/task/submitTask/${id}/${taskId}`, formData);
export const deleteFile = (id, taskId, file) => axios.get(url + `/task/deleteFile/${id}/${taskId}/${file}`);//change
export const fetchMySubmitedFile = (id, taskId) => axios.get(url + `/task/fetchmySubmitedFiles/${id}/${taskId}`);
export const doneTask = (id, taskId) => axios.get(url + `/task/doneTask/${id}/${taskId}`);//change
export const unDoneTask = (id, taskId) => axios.get(url + `/task/unDoneTask/${id}/${taskId}`);//change
export const activeTasks = (id, taskId) => axios.get(url + `/task/activeTask/${id}/${taskId}`);//change
export const unActiveTasks = (id, taskId) => axios.get(url + `/task/unActiveTask/${id}/${taskId}`);//change
export const fetchActiveTasksStudent = () => axios.get(url + `/task/fetchActiveTasksStudent`);
export const fetchCompletedTasksStudent = () => axios.get(url + `/task/fetchCompletedTasksStudent`);
export const fetchActiveTasksTeacher = () => axios.get(url + `/task/fetchActiveTasksTeacher`);
export const fetchCompletedTasksTeacher = () => axios.get(url + `/task/fetchCompletedTasksTeacher`);
export const fetchTaskSubmissions = (id, taskId) => axios.get(url + `/task/taskSubmissions/${id}/${taskId}`);
//chat task
export const fetchMyChats = (id, taskId) => axios.get(url + `/task/fetchMyChats/${id}/${taskId}`);
export const initiateMyChat = (id, taskId) => axios.get(url + `/task/initiateMyChat/${id}/${taskId}`);
export const addCommentToChat = (id, taskId, message) => axios.post(url + `/task/addCommentToChat/${id}/${taskId}`, { message });
export const initiateMyChatTeacher = (id, taskId, studentId) => axios.get(url + `/task/initiateMyChatTeacher/${id}/${taskId}/${studentId}`)
export const fetchMyChatsTeacher = (id, taskId, studentId) => axios.get(url + `/task/fetchMyChatsTeacher/${id}/${taskId}/${studentId}`)
export const addCommentToChatTeacher = (id, taskId, studentId, message) => axios.post(url + `/task/addCommentToChatTeacher/${id}/${taskId}/${studentId}`, { message })

//Review
export const checkMyReview = (id) => axios.get(url + `/review/checkMyReview/${id}`);
export const createReview = (id, reviewDetails, reviewId) => axios.post(url + `/review/createReview`, { id, reviewDetails, reviewId });

//meet
export const checkJoiner = (id) => axios.get(url + `/user/checkJoiner/${id}`);