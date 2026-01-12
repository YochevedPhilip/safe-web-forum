export default function AboutUsPage() {

  const teamMembers = [
    {
      id: 1,
      name: "Lital",
      role: "Developer",
      image: "/lital.jpeg"
    },
    {
      id: 3,
      name: "Shir",
      role: "Developer",
      image: "/shir.jpeg"
    },
    {
      id: 4,
      name: "Yocheved",
      role: "Developer",
      image: "/yocheved.jpeg"
    },
    {
      id: 5,
      name: "Tifferet",
      role: "Developer",
      image: "/tifferet.jpeg"
    }
    ,
    {
      id: 2,
      name: "Sapir",
      role: "Team Leader",
      image: "/sapir.jpeg"
    }
  ];

  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px"
    }}>
      {/* Light Blue Background Section */}
      <div style={{
        width: "100%",
        maxWidth: "1200px",
        background: "#DDEBF7",
        padding: "80px 60px",
        textAlign: "center"
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: "3.5rem",
          fontWeight: 700,
          color: "white",
          marginBottom: "30px",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
        }}>
          Our Team Members
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "1.1rem",
          color: "#666",
          fontStyle: "italic",
          marginBottom: "60px",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
         SafeTalk is a platform that allows you to share your thoughts and ideas with others.
         We built this platform to help you connect with others and share your thoughts and ideas.
        </p>

        {/* Team Members Row */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "40px",
          flexWrap: "nowrap",
          marginBottom: "50px",
          overflowX: "auto",
          padding: "20px 0"
        }}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                textAlign: "center",
                flex: "0 0 auto"
              }}
            >
              {/* Circular Image */}
              <div style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                margin: "0 auto 20px",
                overflow: "hidden",
                border: "5px solid white",
                background: "#f0f0f0"
              }}>
                <img
                  src={member.image}
                  alt={member.name}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.style.background = "#e0e0e0";
                    e.target.parentElement.innerHTML = `<span style="color: #999; font-size: 4rem; font-weight: bold; display: grid; place-items: center; height: 100%;">${member.name.charAt(0)}</span>`;
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>

              {/* Name */}
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#333",
                marginBottom: "8px",
                marginTop: 0
              }}>
                {member.name}
              </h3>

              {/* Role */}
              <p style={{
                fontSize: "0.95rem",
                color: "#666",
                fontWeight: 400,
                margin: 0
              }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
