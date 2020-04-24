const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors:  [authorSchema]
}));
  
async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(id)
{
  // const course = await Course.findById(id);
  // course.author.name = "Rohan Negi";
  // course.save();

  const course = await Course.update({_id:id},{          // directly updating in the database
    $set: {
      'author.name' : 'Raj Singhania'
    }
  });

}

async function addAuthor(id,author)
{
  let course = await Course.findById(id);
  course.authors.push(author);
  await course.save();
}

async function removeAuthor(courseID,authorID){
  let course = await Course.findById(courseID);
  let author = await course.authors.id(authorID);
  author.remove();
  course.save();
}

removeAuthor('5e0204d36a5c7e65750c1cdc','5e020841d1e5ef69991aadb1');

// addAuthor('5e0204d36a5c7e65750c1cdc',new Author({ name: 'Rathore'}));

// updateAuthor('5e01bdab1923411e7d39b9e7');

// createCourse('Node Course', [
//   new Author({ name: 'Rohan' }),
//   new Author({ name: 'Negi' })
// ]);
