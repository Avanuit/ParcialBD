const db = require('../services/mysqlTalent.service');

const registerCandidate = async (req, res) => {
    try {
        const { full_name, email, skills } = req.body;

        if (!full_name || !email) {
            return res.status(400).json({ error: "full_name and email are required" });
        }

        const [result] = await db.query(
            'INSERT INTO candidates (full_name, email, status) VALUES (?, ?, "active")',
            [full_name, email]
        );

        const candidateId = result.insertId;

        if (skills && Array.isArray(skills)) {
            for (const skill of skills) {
                // Find or create skill
                let [skillRows] = await db.query(
                    'SELECT id FROM skills WHERE name = ?',
                    [skill.name]
                );

                let skillId;
                if (skillRows.length === 0) {
                    const [skillResult] = await db.query(
                        'INSERT INTO skills (name) VALUES (?)',
                        [skill.name]
                    );
                    skillId = skillResult.insertId;
                } else {
                    skillId = skillRows[0].id;
                }

                await db.query(
                    'INSERT INTO candidate_skills (candidate_id, skill_id, level) VALUES (?, ?, ?)',
                    [candidateId, skillId, skill.level]
                );
            }
        }

        res.status(201).json({ id: candidateId, full_name, email, status: 'active' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCandidateById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM candidates WHERE id = ?',
            [req.params.id]
        );
        if (!rows[0]) return res.status(404).json({ error: 'Candidate not found' });

        const [skills] = await db.query(
            `SELECT skills.name, candidate_skills.level
             FROM candidate_skills
             JOIN skills ON skills.id = candidate_skills.skill_id
             WHERE candidate_skills.candidate_id = ?`,
            [req.params.id]
        );

        res.json({ ...rows[0], skills });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerCandidate, getCandidateById };