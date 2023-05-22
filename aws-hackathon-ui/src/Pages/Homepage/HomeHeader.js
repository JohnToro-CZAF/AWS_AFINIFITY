import React from 'react'

export default function HomeHeader() {
    return (
        <header style={{backgroundColor: "white", padding: "10px 0"}}>
            <div style={{margin: "auto", maxWidth: "1530px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <div className="flex justify-between items-center">
                        <a href='/' style={{textDecoration: "none", fontSize: "48px", color: "#0E6781", fontWeight: "bold"}}>
                        Thought<span style={{color: "#0E6781"}}>Full</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
