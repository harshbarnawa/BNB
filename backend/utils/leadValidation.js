const serviceIds = new Set(['business', 'commerce', 'portfolio', 'saas', 'landing', 'custom']);
const { validPackage } = require('./servicePackagesCatalog');
const statuses = new Set(['new', 'contacted', 'discussion', 'quotation_sent', 'won', 'lost']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normal = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit + 1) : '';

function parseLeadPayload(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return { error: 'Please provide valid enquiry details.' };
    }

    const name = normal(body.name, 100);
    const email = normal(body.email, 254).toLowerCase();
    const phone = normal(body.phone, 30);
    const company = normal(body.company, 100);
    const serviceId = normal(body.serviceId, 50);
    const budget = normal(body.budget, 80);
    const requirements = normal(body.requirements, 3000);
    const packageTierId = normal(body.packageTierId, 30);

    if (name.length < 2 || name.length > 100 || email.length > 254 ||
        !emailPattern.test(email) || phone.length > 30 || company.length > 100 ||
        budget.length > 80 || !serviceIds.has(serviceId) ||
        requirements.length < 20 || requirements.length > 3000 || body.consent !== true ||
        (packageTierId !== "" && !validPackage(serviceId, packageTierId))) {
        return { error: 'Please check your contact details, service, requirements and consent.' };
    }

    if (phone && !/^[+\d()\s-]{7,30}$/.test(phone)) {
        return { error: 'Please enter a valid phone number or leave it blank.' };
    }

    return { value: { name, email, phone, company, serviceId, packageTierId, budget, requirements, consentAt: new Date() } };
}

module.exports = { parseLeadPayload, statuses };
