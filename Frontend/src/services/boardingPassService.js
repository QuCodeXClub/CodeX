const DEFAULT_PASSES = [
  {
    _id: "default-pass-1",
    boardingPassId: "BP-9876",
    eventName: "CodeX Hackathon 2026",
    eventDescription: "A 24-hour coding marathon",
    prizePool: "₹20,000",
    certificateType: "FOR EVERY VALID SUBMISSION",
    mode: "100% ONLINE",
    teamSize: "SOLO / TEAM (UP TO 3)",
    studentName: "Darshan Kumar",
    studentEmail: "darshan.kumar@qucodex.com",
    qid: "QID-9876",
    citeNumber: "Desk 42",
    loginUser: "Darshan Kumar",
    loginPass: "MKC5236",
    wifiUser: "codex_dev1",
    wifiPass: "D@rsh@n@dm",
    qrCodeImage: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QID-9876",
    createdAt: new Date().toISOString()
  }
];

class BoardingPassService {
  getStoredPasses() {
    const data = localStorage.getItem("codex_boarding_passes");
    if (!data) {
      localStorage.setItem("codex_boarding_passes", JSON.stringify(DEFAULT_PASSES));
      return DEFAULT_PASSES;
    }
    return JSON.parse(data);
  }

  async verifyBoardingPass(boardingPassId) {
    const passes = this.getStoredPasses();
    const matchedPass = passes.find(
      (p) => p.boardingPassId === boardingPassId || p.boardingPassId === `BP-${boardingPassId}`
    );

    if (matchedPass) {
      return {
        success: true,
        data: matchedPass,
      };
    }

    // Default Fallback
    return {
      success: true,
      data: {
        eventName: "CodeX Hackathon 2026",
        eventDescription: "A 24-hour coding marathon",
        prizePool: "₹20,000",
        certificateType: "FOR EVERY VALID SUBMISSION",
        mode: "100% ONLINE",
        teamSize: "SOLO / TEAM (UP TO 3)",
        qrCodeImage: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${boardingPassId}`,
        qid: "QID-9876",
        studentName: "Darshan Kumar",
        citeNumber: "Desk 42",
        boardingPassId: boardingPassId || "BP-12345",
        wifiUser: "codex_dev1",
        wifiPass: "D@rsh@n@dm",
        loginUser: "Darshan Kumar",
        loginPass: "MKC5236",
      },
    };
  }

  async generateBulkBoardingPasses(submitData) {
    const passes = this.getStoredPasses();
    const students = JSON.parse(submitData.studentsStr || "[]");

    const newPasses = students.map((student) => {
      const bpId = `BP-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        _id: Math.random().toString(36).substr(2, 9),
        boardingPassId: bpId,
        eventName: submitData.eventName,
        eventDescription: submitData.eventDescription,
        prizePool: submitData.prizePool || "₹20,000",
        certificateType: submitData.certificateType || "FOR EVERY VALID SUBMISSION",
        mode: submitData.mode || "100% ONLINE",
        teamSize: submitData.teamSize || "SOLO / TEAM (UP TO 3)",
        studentName: student.name,
        studentEmail: student.email,
        qid: student.qid,
        citeNumber: student.citeNumber || "Desk 42",
        loginUser: student.loginUser || student.name,
        loginPass: student.loginPass || "PASS-123",
        wifiUser: student.wifiUser || "codex_wifi",
        wifiPass: student.wifiPass || "WIFI-123",
        qrCodeImage: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(student.qid)}`,
        createdAt: new Date().toISOString(),
      };
    });

    const updatedPasses = [...newPasses, ...passes];
    localStorage.setItem("codex_boarding_passes", JSON.stringify(updatedPasses));

    return {
      success: true,
      message: `${students.length} boarding passes generated successfully!`,
    };
  }

  async getAllBoardingPasses(params = {}) {
    let passes = this.getStoredPasses();

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      passes = passes.filter(
        (p) =>
          p.studentName?.toLowerCase().includes(searchLower) ||
          p.studentEmail?.toLowerCase().includes(searchLower) ||
          p.qid?.toLowerCase().includes(searchLower) ||
          p.boardingPassId?.toLowerCase().includes(searchLower) ||
          p.eventName?.toLowerCase().includes(searchLower)
      );
    }

    return {
      success: true,
      data: {
        boardingPasses: passes,
        pagination: {
          total: passes.length,
          page: params.page || 1,
          totalPages: 1,
        },
      },
    };
  }
}

export const boardingPassService = new BoardingPassService();
export default BoardingPassService;
