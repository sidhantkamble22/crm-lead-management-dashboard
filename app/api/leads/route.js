import { leads } from "@/lib/leads";

const VALID_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost",
];

const VALID_SOURCES = [
  "Website",
  "LinkedIn",
  "Referral",
  "Google",
  "Other",
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone);
}

function validateLead(body) {
  const errors = {};

  const name = typeof body.name === "string"
    ? body.name.trim()
    : "";

  const company = typeof body.company === "string"
    ? body.company.trim()
    : "";

  const email = typeof body.email === "string"
    ? body.email.trim()
    : "";

  const phone = typeof body.phone === "string"
    ? body.phone.trim()
    : "";

  const status = typeof body.status === "string"
    ? body.status.trim()
    : "";

  const source = typeof body.source === "string"
    ? body.source.trim()
    : "";

  // Name
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 100) {
    errors.name = "Name must not exceed 100 characters.";
  }

  // Company
  if (!company) {
    errors.company = "Company is required.";
  } else if (company.length < 2) {
    errors.company = "Company must be at least 2 characters.";
  } else if (company.length > 100) {
    errors.company =
      "Company must not exceed 100 characters.";
  }

  // Email
  if (email && !isValidEmail(email)) {
    errors.email = "Please provide a valid email address.";
  } else if (email.length > 150) {
    errors.email =
      "Email must not exceed 150 characters.";
  }

  // Phone
  if (phone && !isValidPhone(phone)) {
    errors.phone =
      "Please provide a valid 10-digit Indian phone number.";
  }

  // Status
  if (!status) {
    errors.status = "Status is required.";
  } else if (!VALID_STATUSES.includes(status)) {
    errors.status = "Invalid lead status.";
  }

  // Source
  if (!source) {
    errors.source = "Source is required.";
  } else if (!VALID_SOURCES.includes(source)) {
    errors.source = "Invalid lead source.";
  }

  return {
    errors,
    data: {
      name,
      company,
      email,
      phone,
      status,
      source,
    },
  };
}

// GET /api/leads
export async function GET() {
  try {
    return Response.json(leads, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/leads error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch leads.",
      },
      {
        status: 500,
      }
    );
  }
}

// POST /api/leads
export async function POST(request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        {
          status: 400,
        }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json(
        {
          success: false,
          message: "Request body must be a valid object.",
        },
        {
          status: 400,
        }
      );
    }

    const { errors, data } = validateLead(body);

    if (Object.keys(errors).length > 0) {
      return Response.json(
        {
          success: false,
          message: "Validation failed.",
          errors,
        },
        {
          status: 422,
        }
      );
    }

    // Prevent duplicate email
    if (data.email) {
      const duplicateEmail = leads.some(
        (lead) =>
          lead.email?.toLowerCase() ===
          data.email.toLowerCase()
      );

      if (duplicateEmail) {
        return Response.json(
          {
            success: false,
            message:
              "A lead with this email already exists.",
            errors: {
              email: "Email already exists.",
            },
          },
          {
            status: 409,
          }
        );
      }
    }

    const now = new Date();

    const newLead = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status,
      source: data.source,
      createdAt: now.toISOString().split("T")[0],

      activities: [
        {
          id: `${Date.now()}-activity`,
          title: "Lead Created",
          description: "Lead was added to the CRM.",
          createdAt: now.toISOString(),
        },
      ],
    };

    leads.push(newLead);

    return Response.json(
      {
        success: true,
        message: "Lead created successfully.",
        lead: newLead,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/leads error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create lead.",
      },
      {
        status: 500,
      }
    );
  }
}