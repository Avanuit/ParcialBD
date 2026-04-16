const dbjobs = require('../services/mysqlJobs.service');
const dbtalent = require('../services/mysqlTalent.service');

const applyToOffer = async (req, res) => {
    try {
        const { offer_id, candidate_id } = req.body;

        if (!offer_id || !candidate_id) {
            return res.status(400).json({ error: "offer_id and candidate_id are required" });
        }

        // debe existir en dbtalent
        const [candidateRows] = await dbtalent.query(
            'SELECT id, status FROM candidates WHERE id = ?',
            [candidate_id]
        );

        if (candidateRows.length === 0) {
            return res.status(404).json({ error: "Candidate not found in db_talent" });
        }

        if (candidateRows[0].status !== 'active') {
            return res.status(400).json({ error: "Candidate is not active" });
        }

        // no duplicados
        const [existingApp] = await dbjobs.query(
            'SELECT id FROM applications WHERE offer_id = ? AND candidate_id = ?',
            [offer_id, candidate_id]
        );

        if (existingApp.length > 0) {
            return res.status(400).json({ error: "Candidate already applied to this offer" });
        }

        // calificaciones
        const [requiredSkills] = await dbjobs.query(
            'SELECT skill_name, min_level FROM offer_required_skills WHERE offer_id = ?',
            [offer_id]
        );

        if (requiredSkills.length > 0) {
            const [candidateSkills] = await dbtalent.query(
                `SELECT skills.name, candidate_skills.level
                 FROM candidate_skills
                 JOIN skills ON skills.id = candidate_skills.skill_id
                 WHERE candidate_skills.candidate_id = ?`,
                [candidate_id]
            );

            const hasSkill = requiredSkills.some(required =>
                candidateSkills.some(owned =>
                    owned.name.toLowerCase() === required.skill_name.toLowerCase() &&
                    owned.level >= required.min_level
                )
            );

            if (!hasSkill) {
                return res.status(400).json({ error: "Candidate does not meet the required skills for this offer" });
            }
        }

        // Insert application
        const [result] = await dbjobs.query(
            'INSERT INTO applications (offer_id, candidate_id, status) VALUES (?, ?, "pending")',
            [offer_id, candidate_id]
        );

        res.status(201).json({ id: result.insertId, offer_id, candidate_id, status: 'pending' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getApplicationStatus = async (req, res) => {
    try {
        const [rows] = await dbjobs.query(
            `SELECT applications.id, applications.offer_id, applications.candidate_id,
                    applications.status, applications.applied_at,
                    job_offers.title, job_offers.company
             FROM applications
             JOIN job_offers ON job_offers.id = applications.offer_id
             WHERE applications.id = ?`,
            [req.params.id]
        );

        if (!rows[0]) return res.status(404).json({ error: "Application not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllOffers = async (req, res) => {
    try {
        const [offers] = await dbjobs.query('SELECT * FROM job_offers');

        for (const offer of offers) {
            const [skills] = await dbjobs.query(
                'SELECT skill_name, min_level FROM offer_required_skills WHERE offer_id = ?',
                [offer.id]
            );
            offer.required_skills = skills;
        }

        res.json(offers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { applyToOffer, getApplicationStatus, getAllOffers };