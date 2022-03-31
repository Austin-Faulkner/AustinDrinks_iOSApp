//
//  ReviewFormViewControllerTableViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/20/22.
//

import UIKit

class ReviewFormViewController: UITableViewController {
    
    var selectedEstablishmentID: Int?
    
    @IBOutlet var ratingsView: RatingsView!
    @IBOutlet var titleTextField: UITextField!
    @IBOutlet var nameTextField: UITextField!
    @IBOutlet var reviewTextView: UITextView!
//    @IBOutlet var yelpReviewsTextView: UITextView!  // see if we can add a UIView to contain all Yelp reviews. TODO: evaluate whether or not to use this. Probably not.
    

    override func viewDidLoad() {
        super.viewDidLoad()
        print(selectedEstablishmentID as Any)
    }
}

// Indicates what is saved in the user review upon clicking "Save".
// Reviews save to CoreData on the Device, iPhone or iPad
private extension ReviewFormViewController {
    @IBAction func onSaveTapped(_ sender: Any) {
        var reviewItem = ReviewItem()
        reviewItem.rating = ratingsView.rating
        reviewItem.title = titleTextField.text
        reviewItem.name = nameTextField.text
        reviewItem.customerReview = reviewTextView.text
        if let selEstID = selectedEstablishmentID {
            reviewItem.establishmentID = Int64(selEstID)
        }
        CoreDataManager.shared.addReview(reviewItem)
        dismiss(animated: true, completion: nil)
    }
}
