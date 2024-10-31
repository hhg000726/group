import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// 환경 변수에서 WebSocket 서버 URL을 가져옵니다.
const socket = io(process.env.REACT_APP_SOCKET_SERVER, {
  withCredentials: true
});

// 예시 이미지 URL 목록
const memberImages = [
  "https://i.namu.wiki/i/LQyk2LxqYclRpauEkxv6_tKQeNDMnhZxsJZ5PfuJ7KZKO6TStJyYiDn1JqgwMfTwtTg_HXal_ll9vVsM0aWIcs8gF8pxiTxhKxdta0OjjpQsUoajteAlPC9q1jkBxl8kXXM8SV17-nMjV6cwHOsSUg.webp",
  "https://i.namu.wiki/i/kMKv4BXgYsZg1fmhFd_Br1_VCLsZxRXKyse435qJlp7gOe8_rcDoqOIo8e7AK72ICqRBbobNykhyUtH8tG-SDF6-jwiwW3GwY1BqLImt_iH71PBdkdfDAzbSpuDoVpPjSjQMiCzgchoJ8z73mEH8Sg.webp",
  "https://i.namu.wiki/i/vwRhi9S-J4r1o18c9gSAKVMovCW5WKV_EOuVjs5kiaf48AareW9-0gtfmZiOK_s3nZDEAAaB7YIyVJz_ScAUdaZ4dIhiXPSir-K-4t-Tqib8Fv957CEBFtYvrLt4ORuuFbwo9jmKuMrhtARqSphzGA.webp",
  "https://i.namu.wiki/i/vE7xqQ9W6dI5Sje1fTZEdFTfaV4CUeBI4GDwPVwDrt1t9DuPABaGwixi8w61usIDp1onFPYI4dl6vPKwAshz32Dd_2nv0fmyBfNV_YiwdwQnF2iSeybxgGt6LWA5RuJee04mqtFElVgAYt0I0MCM5w.webp",
  "https://i.namu.wiki/i/awUheDzbbt6F7jJAu3yCSJ-WtDXRNS_MEP_b44Aq3jRK6KUlf3QYvOcpWMvSn7Pb3iJTKKs58VZxWWFLe12MHalSH3kKm-Dkbq5fJ8-S1xQhiB0glDwcYxuwKKKo7bdA3StYukC8vQLlYP1bn6y9dQ.webp",
  "https://i.namu.wiki/i/U07rCCGSr0TwX1nAWd3PnCJ96VEhAosuHGtfoD-0OPBqmbwz7ain8RN7h_5jx8hiM_HnmtQ8skYT16hnIARtEaydLTwlnw6JSUzysMwOYx_k2GcfPKC-5zZRcc6h6IIYimCHLmyOZH7MvGI0-f0vUg.webp",
  "https://i.namu.wiki/i/9_Iit6vdVtQEhyKoEFyvZZ7WDdToIi1uewO7ebT-RntX2lLAz9J-wodTOWgfEB6nnd9fP1NnqBktqFcNrQ6El4i_qYNP-2_ZOGRzcL6z8Xe5wBsjPoBKPDhkofWBAEJKx96IB17hQTlLxg3qPCdGHw.webp",
  "https://i.namu.wiki/i/rAvbm_MPEh_fYBgQAwwwQ0hJGdKg3ngloU1A4qWeweKwoNhuhwuzOB3cNgKt30vWcqWm4Y_92U1tOVrLRsbXsNPXigpStcMQl24B59JzfDGqcfEtrQQsH2jKMiwk6eU639cPR6mZA7ysw3PEkv7e6g.webp",
  "https://i.namu.wiki/i/1uQvx2Yc0Dq-BkaCLNkuh6MB-B5M7teZnHmkXTFqPT5HQugFuSLM9ovcay4pNzd9khx71AFGjF4ff2h9hOjbO3igPaWaiJXDbkAznax9JSTKdcW0cJPSTV-NPLZ8fWw-J0GRNyYZzmUhQwCTfeup3w.webp",
  "https://i.namu.wiki/i/-c77KxaFapcD63wXKgOc7eU1kWSwo5NG16RCmJ5dtU-5oLYm-ZEJOR0ip_ujDJeBtLJFlaKIsnTcq4CY8ocfjqcI4Zkqn20vR2rvxHI08GMlnGHrwCHp3_r2Wr1kqYgWOS1TPci4PzdGsM1BmJOsoQ.webp"
];

function App() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    socket.on("updateGroups", (groups) => setGroups(groups));
    return () => socket.off("updateGroups");
  }, []);

  const moveMember = (memberId, newGroupId) => {
    socket.emit("moveMember", { memberId, newGroupId });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",  // 화면 높이의 100% 사용
          gap: "20px"
        }}
      >
        <button
          onClick={() => socket.emit("addGroup")}
          style={{
            padding: "10px 20px",
            fontSize: "36px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
          }}
        >
          그룹 추가
        </button>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          {groups.map((group) => (
            <Group key={group.id} group={group} moveMember={moveMember} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

function Group({ group, moveMember }) {
  const [, drop] = useDrop({
    accept: "member",
    drop: (item) => moveMember(item.memberId, group.id),
  });

  return (
    <div
      ref={drop}
      style={{
        width: "200px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
      }}
    >
      <button
        onClick={() => socket.emit("deleteGroup", group.id)}
        disabled={group.members.length > 0}
        style={{
          padding: "5px 10px",
          fontSize: "36px",
          backgroundColor: group.members.length > 0 ? "#ccc" : "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: group.members.length > 0 ? "not-allowed" : "pointer",
          marginBottom: "10px"
        }}
      >
        그룹 삭제
      </button>
      <ul style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", padding: "0", marginTop: "10px" }}>
        {group.members.map((member) => (
          <Member key={member} member={member} />
        ))}
      </ul>
    </div>
  );
}

function Member({ member }) {
  const [{ isDragging }, drag] = useDrag({
    type: "member",
    item: { memberId: member },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const imageUrl = memberImages[parseInt(member.replace("User", "")) - 1];

  return (
    <li
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        listStyleType: "none",
      }}
    >
      <img
        src={imageUrl}
        alt={member}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "2px solid #4CAF50",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      />
    </li>
  );
}

export default App;