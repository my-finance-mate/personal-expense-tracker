const Group = require('../models/Group');
const User = require('../models/User');
const { generateGroupReport } = require('../utils/generatePdf');

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = new Group({
      name,
      description,
      createdBy: req.user.id,
      members: [{ user: req.user.id, balance: 0 }]
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add expense to group
exports.addExpense = async (req, res) => {
  try {
    const { description, amount, payerId } = req.body;
    const group = await Group.findById(req.params.groupId);
    
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    const expense = {
      description,
      amount,
      payer: payerId,
      paid: false
    };
    
    // Calculate each member's share
    const share = amount / group.members.length;
    group.members = group.members.map(member => ({
      ...member,
      balance: member.balance + share
    }));
    
    group.expenses.push(expense);
    await group.save();
    
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate PDF report
exports.generateReport = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('createdBy', 'name')
      .populate('members.user', 'name')
      .populate('expenses.payer', 'name');
    
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    const pdf = await generateGroupReport(group);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${group.name}_report.pdf`);
    pdf.pipe(res);
    pdf.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};