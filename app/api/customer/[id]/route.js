import Customer from "@/models/Customer";

// GET: Fetch a customer by ID
export async function GET(request, { params }) {
    const id = params.id;
    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return new Response("Customer not found", { status: 404 });
        }
        return new Response(JSON.stringify(customer), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response("Error fetching customer", { status: 500 });
    }
}

// DELETE: Remove a customer by ID
export async function DELETE(request, { params }) {
    const id = params.id;
    try {
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            return new Response("Customer not found", { status: 404 });
        }
        return new Response(JSON.stringify(customer), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response("Error deleting customer", { status: 500 });
    }
}
