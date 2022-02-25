//
//  EstablishmentItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 1/13/22.
//

import UIKit
import MapKit

class EstablishmentItem: NSObject, MKAnnotation, Decodable {
<<<<<<< HEAD
<<<<<<< HEAD
    // For Boston Test:
//    let id: Int?
//    let name: String?
//    let address: String?
//    let city: String?
//    let state: String?
//    let area: String?
//    let postal_code: String?
//    let country: String?
//    let phone: String?
//    let lat: Double?
//    let long: Double?
//    let price: Int?
//    let cuisines: [String]
//    let reserve_url: String?
//    let modile_reserve_url: String?
//    let image_url: String?
    
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
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

    // For Boston Test:
//    enum CodingKeys: String, CodingKey {
//        case id
//        case name
//        case address
//        case city
//        case state
//        case area
//        case postal_code
//        case country
//        case phone
//        case lat
//        case long
//        case price
//        case cuisines
//        case reserve_url
//        case modile_reserve_url
//        case image_url
//    }
    
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

    
    // RUNNING THIS BUILD WILL PRODUCE AN ERROR IN THE fetch(completion:) METHOD IN THE MapDataManager FILE. NEXT SECTION WILL FIX THIS ISSUE. JAnuary 18, 2022, 8:07 pm
    
//    init(dict: [String: AnyObject]) {
//        self.lat = dict["lat"] as? Double
//        self.long = dict["long"] as? Double
//        self.name = dict["name"] as? String
//        self.cuisines = dict["cuisines"] as? [String] ?? []
//        self.address = dict["address"] as? String
//        self.postalCode = dict["postalCode"] as? String
//        self.state = dict["state"] as? String
//        self.imageURL = dict["image_url"] as? String
//        self.restaurantID = dict["id"] as? Int
//    }
    
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
<<<<<<< HEAD
<<<<<<< HEAD
        
//        if cuisines.isEmpty {
//            return ""
//        } else if cuisines.count == 1 {
//            return cuisines.first
//        } else {
//            return cuisines.joined(separator: ", ")
//        }
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
    }
}
