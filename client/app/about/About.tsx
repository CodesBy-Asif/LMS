import { styles } from "../styles/styles";

const About = () => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">Edura</span>?
      </h1>
      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins">
          Welcome to Edura, your ultimate learning platform for mastering
          technology and skills that shape the future. I’m Asif Raza, the founder
          of Edura, and my mission is to provide accessible, high-quality education
          for learners of all levels.
          <br />
          <br />
          At Edura, we understand the challenges of learning new skills in today's
          fast-paced world. That’s why we created a platform that combines
          structured courses, interactive learning content, and a supportive
          community to help you succeed.
          <br />
          <br />
          Our platform offers a wide range of courses from programming, web
          development, data science, to professional soft skills. Each course is
          designed to provide real-world knowledge and practical experience that
          can immediately enhance your career or personal projects.
          <br />
          <br />
          But Edura is more than just courses. We believe learning should be
          engaging, collaborative, and motivating. Our community connects learners
          and mentors, providing guidance, feedback, and inspiration every step of
          the way.
          <br />
          <br />
          With Edura, there are no barriers. Our platform is designed to be
          affordable, inclusive, and accessible to anyone eager to grow their
          skills and achieve their goals.
          <br />
          <br />
          Join Edura today and take the first step toward mastering the skills
          that will define your future. Together, we will learn, create, and
          innovate.
        </p>
        <br />
        <span className="text-[22px] font-Cursive">Asif Raza</span>
        <h5 className="text-[18px] font-Poppins">Founder & CEO of Edura</h5>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
