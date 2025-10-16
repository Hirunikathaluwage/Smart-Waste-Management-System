package com.csse.smartwaste.common.model;

/**
 * Role Enum - Represents user roles in the system
 * Follows Open/Closed Principle - new roles can be added without modifying existing code
 */
public enum Role {
    Resident,  // Manages waste account, requests pickups, makes payments
    Worker,    // Records waste collection, handles bins, reports issues  
    Admin,     // Manages operations, reviews requests, generates reports
    Business   // Manages commercial waste, bulk collections, business accounts
}
