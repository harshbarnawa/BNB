const servicePackages = Object.freeze({
    business: {
        label: "Business websites",
        starter: {
            title: "Essential",
            tagline: "A clean first home for your business.",
            bestFor: "New businesses and simple service sites",
            scope: ["Up to 4 core pages", "Mobile-responsive design", "Contact CTA and form planning", "Basic SEO setup", "Deployment and handover"]
        },
        growth: {
            title: "Growth",
            tagline: "More space to build trust and convert.",
            bestFor: "Established businesses with more to explain",
            scope: ["Up to 8 scoped pages", "Custom section design", "Services and case-study layouts", "Analytics and integrations planning", "Content handover and launch support"]
        }
    },
    commerce: {
        label: "E-commerce websites",
        starter: {
            title: "Storefront",
            tagline: "Bring your catalogue online thoughtfully.",
            bestFor: "Smaller catalogues and early-stage shops",
            scope: ["Responsive storefront", "Product and category layouts", "Search and cart planning", "Checkout integration scope", "Order workflow discussion"]
        },
        growth: {
            title: "Commerce Plus",
            tagline: "A more capable shopping experience.",
            bestFor: "Growing catalogues and operations",
            scope: ["Advanced catalogue navigation", "Filters and product detail flows", "Customer account requirements", "Admin inventory workflow planning", "Payment and fulfilment scope"]
        }
    },
    portfolio: {
        label: "Portfolio websites",
        starter: {
            title: "Personal",
            tagline: "A portfolio with a clear story.",
            bestFor: "Students, freelancers and early-career creators",
            scope: ["Home, about and contact sections", "Selected project showcase", "Responsive presentation", "Social and contact links", "Launch and handover"]
        },
        growth: {
            title: "Signature",
            tagline: "Make your work feel distinctive.",
            bestFor: "Professionals and creative studios",
            scope: ["Custom visual direction", "Detailed case studies", "Thoughtful interactions", "Optional CMS scoping", "Performance-focused delivery"]
        }
    },
    saas: {
        label: "SaaS & dashboards",
        starter: {
            title: "MVP Interface",
            tagline: "Prove the core workflow.",
            bestFor: "Early-stage product prototypes",
            scope: ["Core user journeys", "Dashboard screens", "Reusable interface components", "API integration planning", "MVP delivery milestones"]
        },
        growth: {
            title: "Product Growth",
            tagline: "Extend what your users can do.",
            bestFor: "Teams building operational tools",
            scope: ["Multi-view dashboards", "Roles and permissions scope", "Data visualisation requirements", "Expanded workflows", "Testing and handover planning"]
        }
    },
    landing: {
        label: "Landing pages",
        starter: {
            title: "Launch",
            tagline: "One focused message and next step.",
            bestFor: "Product launches and simple campaigns",
            scope: ["Single responsive page", "Core messaging sections", "Lead capture planning", "Clear CTA hierarchy", "Deployment readiness"]
        },
        growth: {
            title: "Campaign",
            tagline: "Give your campaign more room.",
            bestFor: "Multi-section campaigns and lead generation",
            scope: ["Custom campaign direction", "Extended storytelling sections", "Form integration planning", "Analytics event scope", "Performance and launch review"]
        }
    },
    custom: {
        label: "Custom web applications",
        starter: {
            title: "Discovery",
            tagline: "Define what is worth building.",
            bestFor: "Early-stage ideas and uncertain requirements",
            scope: ["Requirement workshops", "User and workflow mapping", "Feature prioritisation", "Architecture recommendations", "Initial scope proposal"]
        },
        growth: {
            title: "Build",
            tagline: "Move from scope to a working product.",
            bestFor: "Teams ready to develop a scoped application",
            scope: ["Agreed frontend modules", "Backend and database scope", "Authentication needs", "Integration planning", "Milestone-based delivery"]
        }
    }
});

const tierIds = Object.freeze(["starter", "growth", "custom"]);
const pricedTierIds = Object.freeze(["starter", "growth"]);

function validPackage(serviceId, tierId) {
    return Boolean(servicePackages[serviceId] && tierIds.includes(tierId));
}

function buildCatalog(pricing = [], includeAdmin = false) {
    const lookup = new Map(pricing.map((entry) => [
        entry.serviceId + ":" + entry.tierId,
        entry
    ]));

    return Object.entries(servicePackages).flatMap(([serviceId, config]) =>
        tierIds.map((tierId) => {
            const defaults = tierId === "custom"
                ? {
                    title: "Custom",
                    tagline: "Built around your exact brief.",
                    bestFor: "Unique requirements and complex projects",
                    scope: [
                        "Tailored project discovery",
                        "Scope and quotation review",
                        "Agreed milestones and timelines",
                        "Implementation options",
                        "Handover and ownership planning"
                    ]
                }
                : config[tierId];
            const record = lookup.get(serviceId + ":" + tierId);
            const published = tierId !== "custom" && record?.published === true;
            const startingPriceINR = Number.isSafeInteger(record?.startingPriceINR) && record.startingPriceINR >= 1000
                ? record.startingPriceINR
                : null;

            return {
                serviceId,
                serviceLabel: config.label,
                tierId,
                title: defaults.title,
                tagline: defaults.tagline,
                bestFor: defaults.bestFor,
                scope: [...defaults.scope],
                startingPriceINR: published ? startingPriceINR : null,
                ...(includeAdmin ? {
                    draftPriceINR: startingPriceINR,
                    published,
                    editable: tierId !== "custom"
                } : {})
            };
        })
    );
}

module.exports = { servicePackages, tierIds, pricedTierIds, validPackage, buildCatalog };
