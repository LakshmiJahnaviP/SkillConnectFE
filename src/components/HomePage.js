import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Select from 'react-select';
import './styles/HomePage.css';

const HomePage = () => {
  const [user, setUser] = useState({ firstName: "", userId: null });
  const [posts, setPosts] = useState([]); // List of posts
  const [newPost, setNewPost] = useState(""); // Text for the new post
  const [skills, setSkills] = useState([]); // Skill tags for the new post
  const [availableSkills, setAvailableSkills] = useState([]); // Available skills for filtering
  const [filterSkills, setFilterSkills] = useState([]); // Skills used to filter posts
  const [taggedUsers, setTaggedUsers] = useState([]); // List of tagged users
  const [availableUsers, setAvailableUsers] = useState([]); // Users available for tagging


  const location = useLocation();

  // Load user data and available skills
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const firstName = params.get('firstname');

    setUser({ firstName });

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // Retrieve loggedInUser
    if (loggedInUser && loggedInUser.user && loggedInUser.user.id) {
      const userId = loggedInUser.user.id;
      setUser({ firstName, userId }); // Set userId along with firstName
    } else {
      console.error('User ID not found in localStorage');
    }

    fetch('http://localhost:8080/api/skills')
      .then((res) => res.json())
      .then((data) => {
        const skillOptions = data.map((skill) => ({
          value: skill.id,
          label: skill.name,
        }));
        setAvailableSkills(skillOptions);
      })
      .catch((error) => console.error('Error fetching skills:', error));
  }, [location]);

  // Load posts
  useEffect(() => {
    fetch('http://localhost:8080/api/posts')
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched posts:", data);

        // Update posts to show "You" for the logged-in user's posts
        const updatedPosts = data.map((post) => ({
          ...post,
          username: post.userId === user.userId ? "You" : post.username, // Check if the logged-in user created the post
        }));

        // Sort posts by timestamp (most recent on top)
        const sortedPosts = updatedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setPosts(sortedPosts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setPosts([]); // Default to empty array on error
      });
  }, [user.userId]); // Dependency on the logged-in user's ID

  const handleSkillChange = (selectedOptions) => {
    setSkills(selectedOptions || []);

    if (selectedOptions.length > 0) {
      const skillIds = selectedOptions.map((skill) => skill.value);
      fetch(`http://localhost:8080/api/users/by-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skillIds }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch users by skills");
          }
          return res.json();
        })
        .then((data) => {
          const userOptions = data.map((user) => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName} (${user.username})`,
          }));
          setAvailableUsers(userOptions);
        })
        .catch((error) => console.error('Error fetching users:', error));
    } else {
      setAvailableUsers([]); // Clear available users if no skills are selected
      setTaggedUsers([]); // Clear tagged users
    }
  };

  const handleTagUserChange = (selectedOptions) => {
    if (skills.length === 0) {
      alert('Add a skill first to tag users.');
      return;
    }
    setTaggedUsers(selectedOptions || []);
  };




  // Handle post creation
  const handleCreatePost = () => {
    if (newPost.trim() === "") {
      alert("Post cannot be empty!");
      return;
    }
  
    if (skills.length === 0) {
      alert("Please select at least one skill to create a post.");
      return;
    }
  
    const skillIds = skills.map((skill) => skill.value);
    const taggedUserIds = taggedUsers.map((user) => user.value);
  
    const postPayload = {
      userId: user.userId,
      content: newPost.trim(),
      skillIds: skillIds,
      taggedUserIds: taggedUserIds,
    };
  
    fetch('http://localhost:8080/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postPayload),
    })
      .then((res) => res.json())
      .then((newPostResponse) => {
        const postWithUser = {
          ...newPostResponse,
          username: "You",
          taggedUsers: taggedUsers.map((taggedUser) => ({
            id: taggedUser.value,
            name: taggedUser.label,
          })),
        };
  
        setPosts((prevPosts) => [postWithUser, ...prevPosts]);
  
        setNewPost("");
        setSkills([]);
        setTaggedUsers([]);
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        alert("Failed to create post. Check console for details.");
      });
  };
  

  // Handle skill filtering
  const handleFilterChange = (selectedOptions) => {
    setFilterSkills(selectedOptions || []);
  };

  // Filter posts based on selected skills
  const filteredPosts = Array.isArray(posts) ? posts.filter((post) => {
    if (filterSkills.length === 0) return true; // No filtering applied
    return filterSkills.some((skill) => post.skills.some((ps) => ps.id === skill.value));
  }) : [];


  return (
    <div>
      <Navbar />
      <div className="homepage-container">
        <h1>Hello, {user.firstName}!</h1>

        {/* Create Post Section */}
        <div className="create-post-container">
          <textarea
            className="create-post-textbox"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <Select
            isMulti
            options={availableSkills}
            value={skills}
            onChange={handleSkillChange}
            placeholder="Tag skills..."
          />
          <Select
            isMulti
            options={availableUsers}
            value={taggedUsers}
            onChange={handleTagUserChange}
            placeholder="Tag users... (Requires skills)"
            isDisabled={skills.length === 0} // Disable if no skills selected
          />

          <button className="create-post-button" onClick={handleCreatePost}>
            Post
          </button>
        </div>

        {/* Skill Filter Section */}
        <div className="filter-container">
          <Select
            isMulti
            options={availableSkills}
            value={filterSkills}
            onChange={handleFilterChange}
            placeholder="Filter by skills..."
          />
        </div>

        {/* Posts Section */}
      <div className="posts-container">
  {filteredPosts.map((post) => (
    <div key={post.id} className="post">
      <div className="post-header">
        <span 
        className="post-username"
        style={{
          color: "black",
          textDecoration: "underline",
        }}
        >
        {post.firstName && post.username
            ? `${post.firstName} ~ ${post.username}`
            : post.username || "Unknown"}
        </span>
        <span className="post-timestamp">{new Date(post.timestamp).toLocaleString()}</span>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-tagged-users">
        {post.taggedUsers?.length > 0 && (
          <p>Tagged Users: 
            {post.taggedUsers.map((taggedUser) => (
              <span key={taggedUser.id} className="post-tagged-user">
                @{taggedUser.name}
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="post-skills">
        {post.skills?.map((skill) => (
          <span key={skill.id} className="post-skill">
            {skill.name}
          </span>
        ))}
      </div>
      
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default HomePage;
