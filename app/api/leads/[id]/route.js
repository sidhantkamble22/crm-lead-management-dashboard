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

function validateLeadUpdate(body) {
  const errors = {};
  const data = {};

  // Name
  if ("name" in body) {
    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    if (!name) {
      errors.name = "Name cannot be empty.";
    } else if (name.length < 2) {
      errors.name =
        "Name must be at least 2 characters.";
    } else if (name.length > 100) {
      errors.name =
        "Name must not exceed 100 characters.";
    } else {
      data.name = name;
    }
  }

  // Company
  if ("company" in body) {
    const company =
      typeof body.company === "string"
        ? body.company.trim()
        : "";

    if (!company) {
      errors.company =
        "Company cannot be empty.";
    } else if (company.length < 2) {
      errors.company =
        "Company must be at least 2 characters.";
    } else if (company.length > 100) {
      errors.company =
        "Company must not exceed 100 characters.";
    } else {
      data.company = company;
    }
  }

  // Email
  if ("email" in body) {
    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    if (email && !isValidEmail(email)) {
      errors.email =
        "Please provide a valid email address.";
    } else if (email.length > 150) {
      errors.email =
        "Email must not exceed 150 characters.";
    } else {
      data.email = email;
    }
  }

  // Phone
  if ("phone" in body) {
    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    if (phone && !isValidPhone(phone)) {
      errors.phone =
        "Please provide a valid 10-digit Indian phone number.";
    } else {
      data.phone = phone;
    }
  }

  // Status
  if ("status" in body) {
    const status =
      typeof body.status === "string"
        ? body.status.trim()
        : "";

    if (!VALID_STATUSES.includes(status)) {
      errors.status = "Invalid lead status.";
    } else {
      data.status = status;
    }
  }

  // Source
  if ("source" in body) {
    const source =
      typeof body.source === "string"
        ? body.source.trim()
        : "";

    if (!VALID_SOURCES.includes(source)) {
      errors.source = "Invalid lead source.";
    } else {
      data.source = source;
    }
  }

  return {
    errors,
    data,
  };
}

// GET /api/leads/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return Response.json(
        {
          success: false,
          message: "Invalid lead ID.",
        },
        {
          status: 400,
        }
      );
    }

    const lead = leads.find(
      (lead) => lead.id === id
    );

    if (!lead) {
      return Response.json(
        {
          success: false,
          message: "Lead not found.",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(lead, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "GET /api/leads/:id error:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Failed to fetch lead.",
      },
      {
        status: 500,
      }
    );
  }
}

// PUT /api/leads/:id
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return Response.json(
        {
          success: false,
          message: "Invalid lead ID.",
        },
        {
          status: 400,
        }
      );
    }

    const index = leads.findIndex(
      (lead) => lead.id === id
    );

    if (index === -1) {
      return Response.json(
        {
          success: false,
          message: "Lead not found.",
        },
        {
          status: 404,
        }
      );
    }

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

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
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

    const { errors, data } =
      validateLeadUpdate(body);

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

    if (Object.keys(data).length === 0) {
      return Response.json(
        {
          success: false,
          message: "No valid fields provided for update.",
        },
        {
          status: 422,
        }
      );
    }

    // Duplicate email check
    if (data.email) {
      const duplicateEmail = leads.some(
        (lead, leadIndex) =>
          leadIndex !== index &&
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

    const oldLead = leads[index];
    const oldStatus = oldLead.status;
    const newStatus =
      data.status ?? oldStatus;

    // Update only allowed fields
    leads[index] = {
      ...oldLead,
      ...data,
      id: oldLead.id,
      createdAt: oldLead.createdAt,
      activities: oldLead.activities || [],
    };

    // Add activity when status changes
    if (newStatus !== oldStatus) {
      const activity = {
        id: `${Date.now()}-activity`,
        title: "Status Changed",
        description:
          `Status changed from ${oldStatus} to ${newStatus}.`,
        createdAt: new Date().toISOString(),
      };

      leads[index].activities.push(activity);
    }

    return Response.json(
      {
        success: true,
        message: "Lead updated successfully.",
        lead: leads[index],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PUT /api/leads/:id error:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Failed to update lead.",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE /api/leads/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return Response.json(
        {
          success: false,
          message: "Invalid lead ID.",
        },
        {
          status: 400,
        }
      );
    }

    const index = leads.findIndex(
      (lead) => lead.id === id
    );

    if (index === -1) {
      return Response.json(
        {
          success: false,
          message: "Lead not found.",
        },
        {
          status: 404,
        }
      );
    }

    const deletedLead = leads.splice(index, 1)[0];

    return Response.json(
      {
        success: true,
        message: "Lead deleted successfully.",
        lead: deletedLead,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE /api/leads/:id error:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Failed to delete lead.",
      },
      {
        status: 500,
      }
    );
  }
}