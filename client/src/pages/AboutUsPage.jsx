export default function AboutUsPage() {

  const teamMembers = [
    {
      id: 1,
      name: "Team Member 1",
      role: "Developer",
      description: "Passionate about creating safe spaces for meaningful conversations."
    },
    {
      id: 2,
      name: "Team Member 2",
      role: "Developer",
      description: "Dedicated to building user-friendly experiences."
    },
    {
      id: 3,
      name: "Team Member 3",
      role: "Developer",
      description: "Focused on security and user privacy."
    },
    {
      id: 4,
      name: "Team Member 4",
      role: "Developer",
      description: "Committed to making the web a better place."
    }
  ];

  return (
    <div className="mainContainer">
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: 700, 
          color: "var(--luxury-dark)",
          marginBottom: "20px"
        }}>
          About Us
        </h1>
        <p style={{ 
          fontSize: "1.2rem", 
          color: "var(--luxury-dark)",
          maxWidth: "800px",
          margin: "0 auto",
          lineHeight: "1.8"
        }}>
          We are a team of 4 developers committed to creating a safe and supportive platform for sharing thoughts and experiences.
          Our goal is to provide a place where everyone can express themselves freely and securely.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "30px",
        marginBottom: "50px"
      }}>
        {teamMembers.map((member) => (
          <div
            key={member.id}
            style={{
              background: "white",
              borderRadius: "var(--card-radius)",
              padding: "30px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              textAlign: "center",
              transition: "var(--transition-smooth)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)";
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(106, 45, 154, 0.85), rgba(45, 106, 154, 0.8))",
                margin: "0 auto 20px",
                display: "grid",
                placeItems: "center",
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "white",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
              }}
            >
              {member.name.charAt(0)}
            </div>
            <h3 style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--luxury-dark)",
              marginBottom: "10px"
            }}>
              {member.name}
            </h3>
            <p style={{
              fontSize: "1rem",
              color: "var(--accent-teal)",
              fontWeight: 600,
              marginBottom: "15px"
            }}>
              {member.role}
            </p>
            <p style={{
              fontSize: "0.95rem",
              color: "#666",
              lineHeight: "1.6"
            }}>
              {member.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
