import { NextResponse } from "next/server";

type LeadPayload = {
  selectedCarModel?: string;
  selectedWheelModel?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;

    if (
      !payload?.selectedCarModel ||
      !payload?.selectedWheelModel ||
      !payload?.customer?.name ||
      !payload?.customer?.email ||
      !payload?.customer?.phone
    ) {
      return NextResponse.json(
        { ok: false, message: "Missing required lead fields" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Lead received",
      data: {
        selectedCarModel: payload.selectedCarModel,
        selectedWheelModel: payload.selectedWheelModel,
        customer: payload.customer,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
