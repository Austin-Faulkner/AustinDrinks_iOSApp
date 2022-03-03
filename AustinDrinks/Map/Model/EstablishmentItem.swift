//
//  EstablishmentItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/22/22.
//

import UIKit
import MapKit

class EstablishmentItem: NSObject, MKAnnotation, Decodable {

    let name: String?
    let open_for_business: Int?
    let tags: [String]
    let website: String?
<<<<<<< HEAD
<<<<<<< HEAD
//    let long: Double?
//    let lat: Double?
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
    let longitude: Double?
    let latitude: Double?
    let address: String?
    let postal_code: String?
    let city: String?
    let state: String?
    let telephone: String?
    let price: String?
    let hours: [String: String]
    let accommodations: [String]
    let unaccommodations: [String]
<<<<<<< HEAD
<<<<<<< HEAD
    let rating_value: Int?
    let rating_count: Int?
    let reviews: [[String: String]]

   
    enum CodingKeys: String, CodingKey {
        case name = "name"
        case open_for_business = "open_for_business"
        case tags = "tags"
        case website = "website"
//        case long
//        case lat
        case longitude = "longitude" 
        case latitude = "latitude"
        case address = "address"
        case postal_code = "postal_code"
        case city = "city"
        case state = "state"
        case telephone = "telephone"
        case price = "price"
        case hours = "hours"
        case accommodations = "accommodations"
        case unaccommodations = "unaccommodations"
        case rating_value = "rating_vale"
        case rating_count = "rating_count"
        case reviews = "reviews"
=======
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
    let rating_value: Double?
    let rating_count: Int?
    let reviews: [[String: String]] 
    
    enum CodingKeys: String, CodingKey {
        case name
        case open_for_business
        case tags
        case website
        case longitude
        case latitude
        case address
        case postal_code
        case city
        case state
        case telephone
        case price
        case hours
        case accommodations
        case unaccommodations
        case rating_value
        case rating_count
        case reviews
<<<<<<< HEAD
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
    }
    
    var coordinate: CLLocationCoordinate2D {
        guard let latitude = latitude, let longitude = longitude else {
            return CLLocationCoordinate2D()
        }
        return CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
<<<<<<< HEAD
<<<<<<< HEAD
        
//        guard let latitude = lat, let longitude = long else {
//            return CLLocationCoordinate2D()
//        }
//        return CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
    }
    
    var title: String? {
        name
    }
    
    var subtitle: String? {
        if tags.isEmpty {
            return ""
        } else if tags.count == 1 {
            return tags.first
        } else {
            return tags.joined(separator: ", ")
        }
    }
}
