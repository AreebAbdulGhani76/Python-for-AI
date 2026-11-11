
from langchain_core.tools import tool
from core.database.sqlite import save_complaint


order_list = [
    "OR-1045",
    "OR-1046",
    "OR-1047"
]
@tool
def fetch_menu() -> list[dict] :
    return [
     {"name": "Zinger Burger", "price": 850},
     {"name": "Chicken Biryani", "price": 450},
     {"name": "Club Sandwich", "price": 700}
    ]

@tool
def validate_order_id(order_id: str) -> bool :
    if order_id in order_list:
        return True
    return False

@tool
def log_complaint(customer_name : str, order_id : str, phone : int , complaint: str):
    temp_dict = {
        "customer_name": customer_name,
        "order_id": order_id,
        "phone": phone,
        "complaint": complaint,
        "status": "Pending"
    }
    # complaint_list.append(temp_dict)

    # return {
    #     "message": f"Saved! Total Complaint: {len(complaint_list)}"
    # }

Tools=[
     fetch_menu,
     validate_order_id,
     log_complaint
 ]